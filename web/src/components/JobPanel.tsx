// Real stage-by-stage progress of the latest job, retry on failure, and the manual Claude Code step.
import { useEffect, useState } from 'react';
import { api } from '../api.ts';
import { useToast } from '../ui.tsx';
import type { Job, PublicationDetail } from '../../../shared/types.ts';

const ICON = { done: '✓', running: '◌', pending: '·', skipped: '–', waiting: '⏸', failed: '✕' } as const;
const KIND = { generate: 'Generación de contenido', revise: 'Revisión con IA', import: 'Importación de resultado', edit: 'Edición de textos', propose: 'Propuestas creativas (A · B · C)', design_revise: 'Revisión de propuesta', design_edit: 'Ajuste directo (sin IA)', story: 'Historias 1080 × 1920', copy: 'Paso 1 · Opciones de texto' } as const;
const JOB_STATUS = { pending: 'En cola', running: 'En curso', completed: 'Completado', failed: 'Falló' } as const;

export function JobPanel({ job, onChange }: { job: Job; onChange: (d: PublicationDetail) => void }) {
  const [command, setCommand] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const manual = job.outcome === 'task_package';

  useEffect(() => {
    if (manual) api.jobCommand(job.id).then((r) => setCommand(r.command)).catch(() => {});
  }, [manual, job.id]);

  const act = async (fn: () => Promise<PublicationDetail>) => {
    setBusy(true);
    try {
      onChange(await fn());
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setBusy(false);
    }
  };
  const done = job.stages.filter((s) => s.status === 'done').length;

  return (
    <section className="card" aria-live="polite">
      <div className="section-title">
        <h2>{KIND[job.kind]}</h2>
        <span className="tag">#{job.id}</span>
        <span className="spacer" />
        <span className="small muted">
          {manual ? 'Esperando paso manual' : JOB_STATUS[job.status]} · {done} de {job.stages.length} etapas
        </span>
      </div>
      <ol className="stages">
        {job.stages.map((s) => (
          <li key={s.key} className={s.status}>
            <span className="ic" aria-hidden="true">{ICON[s.status]}</span>
            <span>
              {s.label}
              {s.detail && <small>{s.detail}</small>}
            </span>
          </li>
        ))}
      </ol>

      {job.status === 'failed' && (
        <>
          <div className="notice error" style={{ marginTop: 12 }}>{job.error}</div>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn" disabled={busy} onClick={() => act(() => api.retryJob(job.id))}>Reintentar</button>
            <span className="small muted">Las versiones anteriores y la publicación no se han modificado.</span>
          </div>
        </>
      )}

      {manual && (
        <div className="notice warn" style={{ marginTop: 12 }}>
          <b>Paso manual pendiente en Claude Code.</b> No hay una clave de la API de Anthropic configurada, así que la redacción del contenido se
          preparó como una tarea en <span className="mono">{job.task_dir}</span>. Abre una terminal en la carpeta del proyecto y ejecuta:
          {command && (
            <div className="cmd">
              <code>{command}</code>
              <button className="btn sm" onClick={() => navigator.clipboard.writeText(command).then(() => toast('Comando copiado'))}>Copiar</button>
            </div>
          )}
          <div className="row" style={{ marginTop: 6 }}>
            <button className="btn primary" disabled={!job.task_ready || busy} onClick={() => act(() => api.importJob(job.id))}>
              Importar resultado
            </button>
            <span className="small">{job.task_ready ? 'Resultado listo para importar.' : 'El botón se activa cuando Claude Code escriba result.json.'}</span>
            {job.kind === 'generate' || job.kind === 'propose' ? (
              <button className="btn ghost sm" disabled={busy} onClick={() => act(() => (job.kind === 'propose' ? api.proposals(job.publication_id, true) : api.generate(job.publication_id, true)))} title="Por ejemplo, si cambiaste el brief">
                Descartar y preparar de nuevo
              </button>
            ) : (
              <button className="btn ghost sm" disabled={busy} onClick={() => act(() => api.discardJob(job.id))}>Descartar tarea</button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
