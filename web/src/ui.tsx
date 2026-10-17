// Small shared UI pieces.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { STATUS_LABELS, type Brand, type Status } from '../../shared/types.ts';

export const StatusBadge = ({ status }: { status: Status }) => <span className={`badge st-${status}`}>{STATUS_LABELS[status]}</span>;

export const BrandTag = ({ brand }: { brand?: Brand }) =>
  brand ? (
    <span className="brand-tag">
      <i style={{ background: brand.color }} aria-hidden="true" />
      {brand.name}
    </span>
  ) : null;

export function Modal({ title, onClose, children, footer, wide }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
        <header>
          <h2>{title}</h2>
          <span className="spacer" />
          <button className="btn ghost icon" onClick={onClose} aria-label="Cerrar">✕</button>
        </header>
        <div className="body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}

export function Field({ label, hint, optional, children }: { label: string; hint?: string; optional?: boolean; children: ReactNode }) {
  return (
    <label className="field">
      <span>
        {label} {optional && <em>(opcional)</em>}
      </span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

// ---------- toasts ----------
type Toast = { text: string; error?: boolean } | null;
const ToastCtx = createContext<(text: string, error?: boolean) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.error ? 7000 : 3500);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <ToastCtx.Provider value={(text, error) => setToast({ text, error })}>
      {children}
      {toast && (
        <div className={`toast${toast.error ? ' error' : ''}`} role="status">
          {toast.text}
        </div>
      )}
    </ToastCtx.Provider>
  );
}

// ---------- dates ----------
export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const longDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  const wd = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][new Date(y, m - 1, d).getDay()];
  return `${wd} ${d} de ${MONTHS[m - 1]} de ${y}`;
};
export const dateTime = (s: string) => {
  const d = new Date(s.replace(' ', 'T') + 'Z');
  return d.toLocaleString('es-SV', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};
