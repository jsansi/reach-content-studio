// Shell + hash routing: #/ (calendar), #/p/:id (publication), #/preferencias.
import { useEffect, useState } from 'react';
import { api } from './api.ts';
import { Calendar } from './pages/Calendar.tsx';
import { PublicationPage } from './pages/PublicationPage.tsx';
import { Preferences } from './pages/Preferences.tsx';
import type { Brand, Product, Settings } from '../../shared/types.ts';

export interface AppData {
  brands: Brand[];
  products: Product[];
  settings: Settings;
  reloadProducts: () => Promise<Product[]>;
}

const useHash = () => {
  const [hash, setHash] = useState(location.hash || '#/');
  useEffect(() => {
    const f = () => setHash(location.hash || '#/');
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return hash;
};

export function App() {
  const hash = useHash();
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reloadProducts = async () => {
      const products = await api.products();
      setData((d) => (d ? { ...d, products } : d));
      return products;
    };
    Promise.all([api.brands(), api.products(), api.settings()])
      .then(([brands, products, settings]) => setData({ brands, products, settings, reloadProducts }))
      .catch((e) => setError(`No se pudo conectar con el servidor de REACH Content Studio (${e.message}). ¿Está en marcha "npm start"?`));
  }, []);

  const pub = hash.match(/^#\/p\/(\d+)/);
  const page = pub ? 'pub' : hash.startsWith('#/preferencias') ? 'prefs' : 'cal';
  const manual = data?.settings.ai_mode === 'claude_code';

  return (
    <>
      <header className="topbar">
        <a className="wordmark" href="#/">
          <b>reach.</b>
          <span>Content Studio</span>
        </a>
        <nav aria-label="Secciones">
          <a href="#/" aria-current={page !== 'prefs' ? 'page' : undefined}>Calendario</a>
          <a href="#/preferencias" aria-current={page === 'prefs' ? 'page' : undefined}>Preferencias</a>
        </nav>
        {data && (
          <div
            className="mode"
            title={manual ? 'Sin clave de API: los pasos de IA se preparan como tareas para ejecutar en Claude Code.' : `Generación con la API de Anthropic (${data.settings.model}).`}
          >
            <i className={manual ? 'manual' : ''} aria-hidden="true" />
            <span>{manual ? 'IA: Claude Code (paso manual)' : `IA: API de Anthropic`}</span>
          </div>
        )}
      </header>
      <main>
        {error && <div className="notice error">{error}</div>}
        {data && page === 'cal' && <Calendar data={data} />}
        {data && page === 'pub' && <PublicationPage key={pub![1]} id={Number(pub![1])} data={data} />}
        {data && page === 'prefs' && <Preferences data={data} />}
      </main>
    </>
  );
}
