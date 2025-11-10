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

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Home() {
  return (
    <div className="space-y-10" data-testid="home-page">
      <h1 className="text-3xl font-bold">Home</h1>

      <Section title="Réflexion">
        <p className="text-gray-700">Écrivez ici vos réflexions personnelles (support texte simple). Vous pourrez enrichir plus tard avec du markdown.</p>
      </Section>

      <Section title="Mes lectures">
        <p className="text-gray-700">Ajoutez ici des notes de lecture, résumés d’articles, livres, etc.</p>
      </Section>
    </div>
  );
}

function Recherche() {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    // Les PDF ajoutés dans /public/recherche/ seront listés ici
    fetch('/recherche/index.json').then(r => r.json()).then(setFiles).catch(() => setFiles([]));
  }, []);
  return (
    <div className="space-y-6" data-testid="recherche-page">
      <h1 className="text-3xl font-bold">Recherche</h1>
      {files.length === 0 ? (
        <p className="text-gray-700">Ajoutez vos PDF dans public/recherche/ et mettez à jour public/recherche/index.json</p>
      ) : (
        <ul className="space-y-3">
          {files.map((f) => (
            <li key={f.path} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
              <a className="text-blue-600 underline" href={f.path} target="_blank" rel="noreferrer" data-testid={`recherche-item-${f.title}`}>Ouvrir</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Projets() {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    fetch('/projets/index.json').then(r => r.json()).then(setFiles).catch(() => setFiles([]));
  }, []);
  return (
    <div className="space-y-6" data-testid="projets-page">
      <h1 className="text-3xl font-bold">Projets</h1>
      {files.length === 0 ? (
        <p className="text-gray-700">Ajoutez vos PDF de projets dans public/projets/ et mettez à jour public/projets/index.json</p>
      ) : (
        <ul className="space-y-3">
          {files.map((f) => (
            <li key={f.path} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-gray-500">{f.description}</p>
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
