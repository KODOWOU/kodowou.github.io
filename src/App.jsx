import React, { useEffect, useState } from 'react';
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

function Home() {
  return (
    <div className="space-y-10" data-testid="home-page">
      <h1 className="text-3xl font-bold">Home</h1>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Réflexion</h2>
        <p className="text-gray-700">Zone de texte libre. Vous pourrez écrire ici vos réflexions.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Mes lectures</h2>
        <p className="text-gray-700">Zone de texte libre pour notes de lecture.</p>
      </section>
    </div>
  );
}

function ListFromJson({ title, basePath }) {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    fetch(`${basePath}/index.json?_=${Date.now()}`)
      .then(r => r.json())
      .then(setFiles)
      .catch(() => setFiles([]));
  }, [basePath]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {files.length === 0 ? (
        <p className="text-gray-700">Ajoutez vos PDF dans public{basePath}/ et mettez à jour public{basePath}/index.json</p>
      ) : (
        <ul className="space-y-3">
          {files.map((f) => (
            <li key={f.path} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
              <a className="text-blue-600 underline" href={f.path} target="_blank" rel="noreferrer">Ouvrir</a>
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
        <Route path="/recherche" element={<ListFromJson title="Recherche" basePath="/recherche" />} />
        <Route path="/projets" element={<ListFromJson title="Projets" basePath="/projets" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cv" element={<CV />} />
      </Routes>
    </Layout>
  );
}
