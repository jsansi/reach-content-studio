// Monthly editorial calendar with brand/status filters, drag-to-reschedule and a mobile agenda view.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api.ts';
import { PublicationForm } from '../components/PublicationForm.tsx';
import { BrandTag, MONTHS, StatusBadge, iso, useToast } from '../ui.tsx';
import { FORMATS, STATUSES, STATUS_LABELS, type Publication } from '../../../shared/types.ts';
import type { AppData } from '../App.tsx';

const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const KEY = 'reach.calendar';

// Remembered month/filters are a per-browser convenience only; all data lives on the server.
const load = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
};

export function Calendar({ data }: { data: AppData }) {
  const saved = load();
  const today = new Date();
  const [month, setMonth] = useState<Date>(saved.month ? new Date(saved.month + 'T12:00:00') : new Date(today.getFullYear(), today.getMonth(), 1));
  const [brand, setBrand] = useState<string>(saved.brand ?? '');
  const [status, setStatus] = useState<string>(saved.status ?? '');
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [creating, setCreating] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ month: iso(month), brand, status }));
    } catch { /* storage unavailable */ }
  }, [month, brand, status]);

  // 6-week grid starting on Monday.
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [month]);

  const reload = useCallback(() => {
    api.publications({ from: iso(days[0]), to: iso(days[41]), brand, status }).then(setPubs).catch((e) => toast(e.message, true));
  }, [days, brand, status, toast]);
  useEffect(reload, [reload]);

  const byDay = useMemo(() => {
    const m: Record<string, Publication[]> = {};
    for (const p of pubs) (m[p.date] ??= []).push(p);
    return m;
  }, [pubs]);
  const brandOf = (id: string) => data.brands.find((b) => b.id === id);
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const todayIso = iso(today);

  const reschedule = async (pubId: number, date: string) => {
    const p = pubs.find((x) => x.id === pubId);
    if (!p || p.date === date) return;
    try {
      await api.updatePublication(pubId, { date });
      toast(`Reprogramada al ${Number(date.slice(8))} de ${MONTHS[Number(date.slice(5, 7)) - 1]}`);
      reload();
    } catch (e) {
      toast((e as Error).message, true);
    }
  };

  const card = (p: Publication) => (
    <a
      key={p.id}
      className="pcard"
      href={`#/p/${p.id}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', String(p.id))}
      style={{ ['--brand' as string]: brandOf(p.brand_id)?.color }}
      title={`${p.topic} · ${brandOf(p.brand_id)?.name}`}
    >
      <span className="t">{p.topic}</span>
      <span className="m">
        <span>{FORMATS[p.format]}</span>
        <StatusBadge status={p.status} />
      </span>
    </a>
  );

  const monthDays = days.filter((d) => d.getMonth() === month.getMonth() && byDay[iso(d)]);

  return (
    <>
      <div className="cal-head">
        <h1>
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </h1>
        <div className="row">
          <button className="btn icon" onClick={() => shift(-1)} aria-label="Mes anterior">‹</button>
          <button className="btn" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Hoy</button>
          <button className="btn icon" onClick={() => shift(1)} aria-label="Mes siguiente">›</button>
        </div>
        <span className="spacer" />
        <div className="cal-filters">
          <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Filtrar por marca">
            <option value="">Todas las marcas</option>
            {data.brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por estado">
            <option value="">Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <button className="btn primary" onClick={() => setCreating(month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear() ? todayIso : iso(month))}>
          + Nueva publicación
        </button>
      </div>

      <div className="cal" role="grid" aria-label="Calendario editorial">
        {DOW.map((d) => (
          <div key={d} className="dow" role="columnheader">{d}</div>
        ))}
        {days.map((d) => {
          const k = iso(d);
          return (
            <div
              key={k}
              role="gridcell"
              className={`day${d.getMonth() !== month.getMonth() ? ' out' : ''}${dragOver === k ? ' drop' : ''}`}
              onDragOver={(e) => (e.preventDefault(), setDragOver(k))}
              onDragLeave={() => setDragOver((x) => (x === k ? null : x))}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(null);
                reschedule(Number(e.dataTransfer.getData('text/plain')), k);
              }}
            >
              <div className="num">
                <span className={k === todayIso ? 'today' : ''}>{d.getDate()}</span>
                <button className="add" onClick={() => setCreating(k)} aria-label={`Nueva publicación el ${d.getDate()}`}>+</button>
              </div>
              {(byDay[k] ?? []).map(card)}
            </div>
          );
        })}
      </div>

      <div className="agenda" aria-label="Agenda del mes">
        {monthDays.length === 0 && <p className="empty">No hay publicaciones este mes con los filtros elegidos.</p>}
        {monthDays.map((d) => (
          <div className="aday" key={iso(d)}>
            <div>
              <b>{d.getDate()}</b>
              <span className="muted small">{DOW[(d.getDay() + 6) % 7]}</span>
            </div>
            <div>{byDay[iso(d)].map(card)}</div>
          </div>
        ))}
      </div>

      <div className="legend">
        {data.brands.map((b) => (
          <BrandTag key={b.id} brand={b} />
        ))}
        <span>Arrastra una publicación a otro día para reprogramarla.</span>
      </div>

      {creating && (
        <PublicationForm
          data={data}
          initial={{ date: creating }}
          onClose={() => setCreating(null)}
          onSaved={(p) => {
            setCreating(null);
            toast('Publicación guardada en el calendario');
            location.hash = `#/p/${p.id}`;
          }}
        />
      )}
    </>
  );
}
