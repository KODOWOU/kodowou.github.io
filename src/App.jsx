import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { marked } from 'marked';

function Layout({ children }) {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between" data-testid="main-navbar">
          <Link to="/" className="text-white font-semibold text-lg" data-testid="brand-link">Mon Site Personnel</Link>
          <div className="flex items-center gap-6">
            <NavLink to="/" end className={({isActive}) => `nav-link ${isActive ? 'active-link' : ''}`} data-testid="nav-home">Home</NavLink>
            <NavLink to="/recherche" className={({isActive}) => `nav-link ${isActive ? 'active-link' : ''}`} data-testid="nav-recherche">Recherche</NavLink>
            <NavLink to="/projets" className={({isActive}) => `nav-link ${isActive ? 'active-link' : ''}`} data-testid="nav-projets">Projets</NavLink>
            <NavLink to="/contact" className={({isActive}) => `nav-link ${isActive ? 'active-link' : ''}`} data-testid="nav-contact">Contact</NavLink>
            <NavLink to="/cv" className={({isActive}) => `nav-link ${isActive ? 'active-link' : ''}`} data-testid="nav-cv">CV</NavLink>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-10 grow">{children}</main>
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-500" data-testid="footer">© {new Date().getFullYear()} — Tous droits réservés.</div>
      </footer>
    </div>
  );
}

function useMarkdown(path) {
  const [html, setHtml] = useState('');
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    fetch(`${path}?_=${Date.now()}`)
      .then(async r => {
        if (!r.ok) { setMissing(true); return; }
        const txt = await r.text();
        setHtml(marked.parse(txt));
      })
      .catch(() => setMissing(true));
  }, [path]);
  return { html, missing };
}

function Home() {
  const about = useMarkdown('/contenu/about.md');
  const reflexion = useMarkdown('/contenu/reflexion.md');
  const lectures = useMarkdown('/contenu/mes-lectures.md');
  return (
    <div className="space-y-10" data-testid="home-page">
      <div className="hero">
        <div className="space-y-4">
          <div className="avatar" data-testid="home-avatar">K A</div>
          <div>
            <h1 className="text-3xl font-bold" data-testid="home-name">Kodjo Anthelme Kodowou</h1>
            <p className="text-gray-600">Étudiant en Économie / Ingénierie Financière</p>
            <ul className="info-list mt-3">
              <li>Université / Établissement (à préciser)</li>
              <li>Email: contact@example.com</li>
            </ul>
          </div>
        </div>
        <div className="space-y-8">
          <section>
            <h2 className="section-title">À propos de moi</h2>
            {about.missing ? (
              <p className="text-gray-700">Ajoutez un fichier public/contenu/about.md pour afficher votre biographie.</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: about.html }} data-testid="home-about" />
            )}
          </section>
          <section>
            <h3 className="font-semibold">Intérêts</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Développement économique</li>
              <li>Finance quantitative</li>
              <li>Économie des familles</li>
            </ul>
          </section>
        </div>
      </div>

      <section>
        <h2 className="section-title">Réflexion</h2>
        {reflexion.missing ? (
          <p className="text-gray-700">Créez public/contenu/reflexion.md pour écrire vos réflexions.</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: reflexion.html }} data-testid="home-reflexion" />
        )}
      </section>

      <section>
        <h2 className="section-title">Mes lectures</h2>
        {lectures.missing ? (
          <p className="text-gray-700">Créez public/contenu/mes-lectures.md pour vos notes de lecture.</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: lectures.html }} data-testid="home-lectures" />
        )}
      </section>
    </div>
  );
}

function normalizePath(p) {
  if (!p) return '#';
  if (/^https?:\/\//.test(p)) return p; // URL absolue
  let out = p.trim();
  if (out.startsWith('public/')) out = out.substring('public/'.length);
  if (out.startsWith('/public/')) out = out.substring('/public'.length);
  if (!out.startsWith('/')) out = '/' + out;
  // supprimer doubles slashs (sauf https://)
  out = out.replace(/(^|[^:])\/\/+/, '$1/');
  return out;
}

function formatDate(d) {
  try { return new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' }); } catch { return null; }
}

function useJsonList(basePath) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const url = `${basePath}/index.json?_=${Date.now()}`; // cache-buster
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const txt = await r.text();
        const data = JSON.parse(txt);
        const arr = Array.isArray(data) ? data : (data ? [data] : []);
        const normalized = arr.map((x, idx) => ({
          title: x.title || `Élément ${idx+1}`,
          description: x.description || '',
          path: normalizePath(x.path),
          date: x.date || x.added_at || null,
          category: x.category || 'autres',
        }));
        setItems(normalized);
      })
      .catch((e) => { setError(e.message); setItems([]); });
  }, [basePath]);
  return { items, error };
}

function Recherche() {
  const { items, error } = useJsonList('/recherche');
  const groups = useMemo(() => {
    const order = ['etudiants', 'working_papers', 'publies', 'autres'];
    const labels = {
      etudiants: 'Travaux étudiants',
      working_papers: 'Working papers',
      publies: 'Articles publiés',
      autres: 'Autres',
    };
    const m = {};
    for (const it of items) {
      const k = order.includes(it.category) ? it.category : 'autres';
      if (!m[k]) m[k] = [];
      m[k].push(it);
    }
    for (const k of Object.keys(m)) {
      m[k].sort((a,b)=> new Date(b.date||0) - new Date(a.date||0));
    }
    return { order, labels, m };
  }, [items]);

  return (
    <div className="space-y-8" data-testid="recherche-page">
      <h1 className="text-3xl font-bold">Recherche</h1>
      {error && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">Erreur de lecture: {error}</div>
      )}
      {groups.order.map((k) => (
        <div key={k} className="space-y-3">
          {groups.m[k] && groups.m[k].length > 0 && (
            <>
              <h2 className="text-xl font-semibold">{groups.labels[k]}</h2>
              <ul className="space-y-3">
                {groups.m[k].map((f) => (
                  <li key={f.path} className="card p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{f.title}</p>
                      <p className="text-sm text-gray-500">
                        {f.description}
                        {f.date ? ` · ${formatDate(f.date)}` : ''}
                      </p>
                    </div>
                    <a className="text-blue-600 underline" href={f.path} target="_blank" rel="noreferrer" data-testid={`recherche-item-${f.title}`}>Ouvrir</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
      {(!items || items.length === 0) && (
        <p className="text-gray-700">Ajoutez vos PDF dans public/recherche/ et mettez à jour public/recherche/index.json</p>
      )}
    </div>
  );
}

function Projets() {
  const { items, error } = useJsonList('/projets');
  return (
    <div className="space-y-6" data-testid="projets-page">
      <h1 className="text-3xl font-bold">Projets</h1>
      {error && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">Erreur de lecture: {error}</div>
      )}
      {(!items || items.length === 0) ? (
        <p className="text-gray-700">Ajoutez vos PDF de projets dans public/projets/ et mettez à jour public/projets/index.json</p>
      ) : (
        <ul className="space-y-3">
          {items.map((f) => (
            <li key={f.path} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-gray-500">{f.description}{f.date ? ` · ${formatDate(f.date)}` : ''}</p>
              </div>
              <a className="text-blue-600 underline" href={f.path} target="_blank" rel="noreferrer" data-testid={`projet-item-${f.title}`}>Ouvrir</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Contact() {
  return (
    <div className="space-y-6" data-testid="contact-page">
      <h1 className="text-3xl font-bold">Contact</h1>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>E‑mail: <a className="text-blue-600 underline" href="mailto:contact@example.com" data-testid="contact-email">contact@example.com</a></li>
      </ul>
    </div>
  );
}

function CV() {
  return (
    <div className="space-y-6" data-testid="cv-page">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">CV</h1>
        <a href="/cv.pdf" download className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" data-testid="cv-download-button">Télécharger le PDF</a>
      </div>
      <div className="card p-0 overflow-hidden" data-testid="cv-pdf-viewer">
        <iframe title="cv-pdf" src="/cv.pdf#view=FitH" className="w-full h-[80vh]" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recherche" element={<Recherche />} />
        <Route path="/projets" element={<Projets />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cv" element={<CV />} />
      </Routes>
    </Layout>
  );
}
