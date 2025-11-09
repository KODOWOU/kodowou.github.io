import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

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

function Home() {
  return (
    <div className="space-y-6" data-testid="home-page">
      <h1 className="text-3xl font-bold">Home</h1>
      <p className="text-gray-700">Cette page remplace l’onglet Biographie. Aucun message de bienvenue n’est affiché.</p>
    </div>
  );
}

function Recherche() {
  return (
    <div className="space-y-6" data-testid="recherche-page">
      <h1 className="text-3xl font-bold">Recherche</h1>
      <p className="text-gray-700">Ajoutez ici vos travaux de recherche, publications, working papers, etc.</p>
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
  const [view, setView] = useState('web');
  const backendUrl = useMemo(() => (import.meta.env && import.meta.env.REACT_APP_BACKEND_URL) || undefined, []);
  const [apiOk, setApiOk] = useState(null);
  useEffect(() => {
    if (!backendUrl) return; // respect env-only rule
    fetch(`${backendUrl}/api/health`).then(r => r.json()).then(() => setApiOk(true)).catch(() => setApiOk(false));
  }, [backendUrl]);

  return (
    <div className="space-y-6" data-testid="cv-page">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">CV</h1>
        <a href="/cv.pdf" download className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" data-testid="cv-download-button">Télécharger le PDF</a>
      </div>

      <div className="inline-flex rounded-md border bg-white" role="tablist" data-testid="cv-view-toggle">
        <button onClick={() => setView('web')} className={`px-4 py-2 ${view==='web' ? 'bg-blue-50 text-blue-700' : ''}`} data-testid="cv-view-web">Version web</button>
        <button onClick={() => setView('pdf')} className={`px-4 py-2 border-l ${view==='pdf' ? 'bg-blue-50 text-blue-700' : ''}`} data-testid="cv-view-pdf">Lecteur PDF</button>
      </div>

      {view === 'web' ? (
        <div className="card p-6" data-testid="cv-web">
          <p className="text-gray-700">Ci-dessous, un aperçu en ligne de votre CV à partir du fichier stocké dans le dépôt. Pour une mise en page fidèle, utilisez l’onglet «Lecteur PDF» ou téléchargez le fichier.</p>
          <div className="mt-6 aspect-[8.5/11] bg-gray-100 border border-dashed grid place-items-center text-gray-500">
            <span data-testid="cv-web-placeholder">Version web simplifiée du CV</span>
          </div>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden" data-testid="cv-pdf-viewer">
          <iframe title="cv-pdf" src="/cv.pdf#view=FitH" className="w-full h-[80vh]" />
        </div>
      )}

      {apiOk === false && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3" data-testid="backend-warning">
          Le backend n’est pas joignable pour l’instant (vérification /api/health). Ce site peut néanmoins fonctionner sans.
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recherche" element={<Recherche />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cv" element={<CV />} />
      </Routes>
    </Layout>
  );
}
