'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DOMAINES = [
  "Agriculture & Agroalimentaire","Arts & Culture","Banque & Finance",
  "Commerce & Entrepreneuriat","Communication & Médias","Droit & Justice",
  "Éducation & Formation","Énergie & Environnement","Ingénierie & BTP",
  "Innovation & Tech","Médecine & Santé","Politique & Gouvernance",
  "Recherche & Sciences","Sport & Performance","Tourisme & Hôtellerie",
  "Relations internationales","Autre"
];
const STATUTS = ["Salarié(e)","Étudiant(e)","Entrepreneur(e)","Profession libérale"];
const AGES = ["18 – 25 ans","26 – 35 ans","36 – 45 ans","46 – 55 ans","56 ans et plus"];
const NIVEAUX = ["Baccalauréat","Bac +2 (BTS, DUT…)","Bac +3 (Licence, Bachelor…)","Bac +5 (Master, Grande École…)","Bac +8 (Doctorat, PhD…)"];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --bg: #080c14;
    --bg2: #0a0f1a;
    --bg3: #0d1525;
    --border: rgba(92,138,184,0.15);
    --border-active: rgba(92,138,184,0.5);
    --gold: #5a8ab8;
    --gold-light: #7eb8f7;
    --gold-dim: rgba(92,138,184,0.4);
    --text: #c8daf0;
    --text-dim: #4a6080;
    --text-muted: #2a4060;
  }

  .f-body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .f-body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(ellipse at 20% 20%, rgba(92,138,184,0.04) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(92,138,184,0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .f-geo {
    position: fixed; top: 0; right: 0;
    width: 320px; height: 320px;
    opacity: 0.03; pointer-events: none; z-index: 0;
  }

  .f-wrapper {
    position: relative; z-index: 1;
    max-width: 680px; margin: 0 auto;
    padding: 60px 32px 80px;
  }

  .f-header {
    text-align: center;
    margin-bottom: 52px;
    animation: fadeUp 0.8s ease both;
  }

  .f-tag {
    font-family: 'Jost', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 20px;
    display: flex; align-items: center;
    justify-content: center; gap: 12px;
  }
  .f-tag::before, .f-tag::after {
    content: ''; width: 32px; height: 1px;
    background: var(--gold); opacity: 0.4;
  }

  .f-header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 6vw, 50px);
    font-weight: 300; line-height: 1.1;
    color: #f0e6c8; margin-bottom: 16px;
    letter-spacing: -0.01em;
  }
  .f-header h1 em { font-style: italic; color: var(--gold-light); }

  .f-header p {
    font-size: 13px; line-height: 1.7;
    color: var(--text-dim); max-width: 460px; margin: 0 auto;
  }

  .f-ornament {
    display: flex; align-items: center;
    justify-content: center; gap: 10px; margin-top: 28px;
  }
  .f-ornament span {
    display: block; width: 6px; height: 6px;
    background: var(--gold); transform: rotate(45deg); opacity: 0.6;
  }
  .f-ornament::before, .f-ornament::after {
    content: ''; flex: 1; max-width: 80px; height: 1px;
    background: linear-gradient(to right, transparent, var(--gold-dim));
    opacity: 0.4;
  }
  .f-ornament::after { background: linear-gradient(to left, transparent, var(--gold-dim)); }

  .f-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 28px;
    animation: fadeUp 0.8s 0.15s ease both;
  }

  .f-field { position: relative; }
  .f-field.full { grid-column: 1 / -1; }

  .f-section-label {
    grid-column: 1 / -1;
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px; font-weight: 400;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--gold-dim); margin-top: 8px; margin-bottom: -8px;
  }

  .f-sep {
    grid-column: 1 / -1; height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin: 4px 0;
  }

  .f-label {
    display: block; font-size: 10px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 10px; opacity: 0.85;
  }

  .f-input {
    width: 100%;
    background: rgba(92,138,184,0.04);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 14px 16px;
    font-family: 'Jost', sans-serif;
    font-size: 14px; font-weight: 300;
    color: var(--text);
    transition: border-color 0.25s, background 0.25s;
    outline: none; appearance: none; -webkit-appearance: none;
    box-sizing: border-box;
  }
  .f-input::placeholder { color: rgba(200,218,240,0.2); }
  .f-input:focus {
    border-color: var(--border-active);
    background: rgba(92,138,184,0.07);
  }

  .f-select-wrap { position: relative; }
  .f-select-wrap::after {
    content: '';
    position: absolute; right: 16px; top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 7px; height: 7px;
    border-right: 1.5px solid var(--gold);
    border-bottom: 1.5px solid var(--gold);
    pointer-events: none; opacity: 0.6;
  }
  .f-select-wrap select option { background: #0d1525; color: var(--text); }

  /* Checkboxes domaines */
  .f-domains-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }

  .f-check { position: relative; }
  .f-check input[type="checkbox"] {
    position: absolute; opacity: 0; width: 0; height: 0;
  }
  .f-check label {
    display: flex; align-items: center;
    padding: 11px 14px;
    border: 1px solid rgba(92,138,184,0.15);
    border-radius: 2px; cursor: pointer;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.04em;
    color: var(--text-dim);
    transition: all 0.2s; gap: 10px;
    background: rgba(92,138,184,0.02);
    text-transform: none;
  }
  .f-check label::before {
    content: ''; flex-shrink: 0;
    width: 14px; height: 14px;
    border: 1px solid rgba(92,138,184,0.3);
    border-radius: 2px; transition: all 0.2s;
  }
  .f-check input[type="checkbox"]:checked + label {
    border-color: var(--border-active);
    color: var(--gold-light);
    background: rgba(92,138,184,0.07);
  }
  .f-check input[type="checkbox"]:checked + label::before {
    background: var(--gold);
    border-color: var(--gold);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 12 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 5l3.5 3.5L11 1' stroke='%23080c14' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: center; background-size: 10px;
  }
  .f-check label:hover { border-color: var(--border-active); color: var(--text); }

  /* Radio statut */
  .f-radio-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  .f-radio { position: relative; }
  .f-radio input[type="radio"] {
    position: absolute; opacity: 0; width: 0; height: 0;
  }
  .f-radio label {
    display: flex; align-items: center; justify-content: center;
    padding: 14px;
    border: 1px solid rgba(92,138,184,0.15);
    border-radius: 2px; cursor: pointer;
    font-size: 13px; font-weight: 400;
    letter-spacing: 0.06em; text-transform: none;
    color: var(--text-dim);
    transition: all 0.2s;
    background: rgba(92,138,184,0.02);
  }
  .f-radio input[type="radio"]:checked + label {
    border-color: var(--border-active);
    color: var(--gold-light);
    background: rgba(92,138,184,0.08);
  }
  .f-radio label:hover { border-color: var(--border-active); color: var(--text); }

  /* Privacy */
  .f-privacy {
    grid-column: 1 / -1;
    border: 1px solid rgba(92,138,184,0.12);
    border-radius: 2px;
    background: rgba(92,138,184,0.02);
    overflow: hidden;
  }
  .f-privacy-header {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(92,138,184,0.08);
    background: rgba(92,138,184,0.04);
  }
  .f-privacy-title {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); opacity: 0.85;
  }
  .f-privacy-body { padding: 16px 18px; }
  .f-privacy-body > p {
    font-size: 12px; line-height: 1.7;
    color: rgba(200,218,240,0.45); margin-bottom: 14px;
  }
  .f-privacy-items { display: flex; flex-direction: column; gap: 8px; }
  .f-privacy-item { font-size: 12px; line-height: 1.6; color: rgba(200,218,240,0.4); }
  .f-privacy-lbl {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(92,138,184,0.55); margin-right: 8px;
  }
  .f-privacy-link {
    color: rgba(92,138,184,0.65); text-decoration: none;
    border-bottom: 1px solid rgba(92,138,184,0.3);
  }

  /* Submit */
  .f-submit-area {
    grid-column: 1 / -1;
    display: flex; flex-direction: column;
    align-items: center; gap: 16px; margin-top: 16px;
  }
  .f-btn {
    background: var(--gold);
    color: var(--bg);
    border: none;
    padding: 16px 52px;
    font-family: 'Jost', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.25em; text-transform: uppercase;
    cursor: pointer; transition: all 0.25s;
    border-radius: 1px; position: relative; overflow: hidden;
  }
  .f-btn::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,0.1);
    transform: translateX(-100%); transition: transform 0.3s;
  }
  .f-btn:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(92,138,184,0.2); }
  .f-btn:hover::before { transform: translateX(100%); }
  .f-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .f-submit-note {
    font-size: 11px; color: rgba(74,96,128,0.6);
    text-align: center; letter-spacing: 0.02em;
  }

  .f-error {
    grid-column: 1 / -1;
    font-size: 13px; padding: 12px 16px;
    border: 1px solid rgba(248,113,113,0.3);
    border-radius: 2px; background: rgba(248,113,113,0.05);
    color: #f87171;
  }

  /* Success */
  .f-success {
    text-align: center; padding: 60px 32px;
    animation: fadeUp 0.5s ease both;
  }
  .f-success-icon {
    width: 56px; height: 56px;
    border: 1px solid var(--gold); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px; color: var(--gold); font-size: 24px;
  }
  .f-success h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 300;
    color: #f0e6c8; margin-bottom: 12px;
  }
  .f-success p { color: var(--text-dim); font-size: 14px; line-height: 1.7; }

  .f-footer {
    text-align: center; margin-top: 64px;
    font-size: 11px; color: rgba(74,96,128,0.35);
    letter-spacing: 0.15em; text-transform: uppercase;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 540px) {
    .f-grid { grid-template-columns: 1fr; gap: 20px; }
    .f-field.full { grid-column: auto; }
    .f-section-label, .f-sep, .f-privacy, .f-submit-area, .f-error { grid-column: auto; }
    .f-domains-grid { grid-template-columns: 1fr; }
    .f-radio-grid { grid-template-columns: 1fr 1fr; }
    .f-wrapper { padding: 40px 20px 60px; }
  }
`;

export default function Formulaire() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', age: '', pays: '',
    niveau: '', ecoles: '', domaines: [], statut: '', poste: '', entreprise: '', linkedin: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleDomaine = (d) => setForm(f => ({
    ...f,
    domaines: f.domaines.includes(d) ? f.domaines.filter(x => x !== d) : [...f.domaines, d]
  }));

  const handleSubmit = async () => {
    if (!form.pays || !form.statut || form.domaines.length === 0) {
      setError("Merci de renseigner au moins votre pays, statut et domaine d'expertise.");
      return;
    }
    setLoading(true); setError('');
    const { error: err } = await supabase.from('talents').insert([{
      nom: form.nom, prenom: form.prenom, email: form.email,
      age: form.age, pays: form.pays, niveau: form.niveau,
      ecoles: form.ecoles, domaines: form.domaines.join(', '),
      statut: form.statut, poste: form.poste,
      entreprise: form.entreprise, linkedin: form.linkedin,
    }]);
    setLoading(false);
    if (err) { setError('Une erreur est survenue. Veuillez réessayer.'); return; }
    setSubmitted(true);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="f-body">
        <div className="f-geo">
          <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="160" cy="160" r="150" stroke="#5a8ab8" strokeWidth="0.5"/>
            <circle cx="160" cy="160" r="100" stroke="#5a8ab8" strokeWidth="0.5"/>
            <circle cx="160" cy="160" r="50" stroke="#5a8ab8" strokeWidth="0.5"/>
            <line x1="160" y1="10" x2="160" y2="310" stroke="#5a8ab8" strokeWidth="0.5"/>
            <line x1="10" y1="160" x2="310" y2="160" stroke="#5a8ab8" strokeWidth="0.5"/>
            <line x1="54" y1="54" x2="266" y2="266" stroke="#5a8ab8" strokeWidth="0.5"/>
            <line x1="266" y1="54" x2="54" y2="266" stroke="#5a8ab8" strokeWidth="0.5"/>
            <polygon points="160,60 247,210 73,210" stroke="#5a8ab8" strokeWidth="0.5" fill="none"/>
            <polygon points="160,260 73,110 247,110" stroke="#5a8ab8" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>

        <div className="f-wrapper">
          {submitted ? (
            <div className="f-success">
              <div className="f-success-icon">✦</div>
              <h2>Merci pour votre contribution</h2>
              <p>Votre profil a bien été enregistré.<br/>Ensemble, nous bâtissons la carte des talents du Bénin.</p>
              <a href="/" style={{ display: 'inline-block', marginTop: 28, color: 'var(--gold)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(92,138,184,0.35)', paddingBottom: 2 }}>← Voir la cartographie</a>
            </div>
          ) : (
            <>
              <header className="f-header">
                <div className="f-tag">Cartographie Nationale</div>
                <h1>Cartographie des<br/><em>Talents Béninois</em></h1>
                <p>Ceci est une étude privée et indépendante pour le recensement des compétences béninoises, en local ou à l'étranger. Une démarche pour valoriser l'excellence béninoise et mobiliser ses talents au service du développement.</p>
                <div className="f-ornament"><span></span></div>
              </header>

              <div className="f-grid">

                {/* Identité */}
                <div className="f-section-label">Identité</div>
                <div className="f-field">
                  <label className="f-label">Nom</label>
                  <input className="f-input" type="text" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Votre nom de famille" />
                </div>
                <div className="f-field">
                  <label className="f-label">Prénom</label>
                  <input className="f-input" type="text" value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Votre prénom" />
                </div>
                <div className="f-field full">
                  <label className="f-label">Adresse mail personnelle</label>
                  <input className="f-input" type="text" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre@email.com" />
                </div>
                <div className="f-field full">
                  <label className="f-label">Tranche d'âge</label>
                  <div className="f-select-wrap">
                    <select className="f-input" value={form.age} onChange={e => set('age', e.target.value)}>
                      <option value="">Sélectionner votre tranche d'âge</option>
                      {AGES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="f-sep"></div>

                {/* Localisation */}
                <div className="f-section-label">Localisation</div>
                <div className="f-field full">
                  <label className="f-label">Pays de résidence actuelle</label>
                  <div className="f-select-wrap">
                    <select className="f-input" value={form.pays} onChange={e => set('pays', e.target.value)}>
                      <option value="">Sélectionner votre pays de résidence</option>
                      <option value="Bénin">🇧🇯 Bénin</option>
                      <optgroup label="Afrique">
                        {["Afrique du Sud","Algérie","Angola","Botswana","Burkina Faso","Burundi","Cameroun","Cap-Vert","Centrafrique","Comores","Congo","Côte d'Ivoire","Djibouti","Égypte","Érythrée","Éthiopie","Gabon","Gambie","Ghana","Guinée","Guinée-Bissau","Guinée équatoriale","Kenya","Lesotho","Liberia","Libye","Madagascar","Malawi","Mali","Maroc","Maurice","Mauritanie","Mozambique","Namibie","Niger","Nigeria","Ouganda","RD Congo","Rwanda","São Tomé-et-Príncipe","Sénégal","Seychelles","Sierra Leone","Somalie","Soudan","Soudan du Sud","Swaziland","Tanzanie","Tchad","Togo","Tunisie","Zambie","Zimbabwe"].map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Europe">
                        {["Allemagne","Autriche","Belgique","Bulgarie","Croatie","Danemark","Espagne","Estonie","Finlande","France","Grèce","Hongrie","Irlande","Islande","Italie","Lettonie","Lituanie","Luxembourg","Malte","Norvège","Pays-Bas","Pologne","Portugal","République tchèque","Roumanie","Royaume-Uni","Russie","Slovaquie","Slovénie","Suède","Suisse","Ukraine"].map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Amériques">
                        {["Argentine","Bolivie","Brésil","Canada","Chili","Colombie","Costa Rica","Cuba","Équateur","États-Unis","Guadeloupe","Guatemala","Haïti","Honduras","Jamaïque","Martinique","Mexique","Panama","Paraguay","Pérou","République dominicaine","Uruguay","Venezuela"].map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Asie & Moyen-Orient">
                        {["Arabie Saoudite","Azerbaïdjan","Bangladesh","Chine","Corée du Sud","Émirats arabes unis","Inde","Indonésie","Irak","Iran","Israël","Japon","Jordanie","Kazakhstan","Koweït","Liban","Malaisie","Pakistan","Philippines","Qatar","Singapour","Syrie","Thaïlande","Turquie","Vietnam"].map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Océanie">
                        {["Australie","Nouvelle-Zélande"].map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="f-sep"></div>

                {/* Formation */}
                <div className="f-section-label">Formation</div>
                <div className="f-field full">
                  <label className="f-label">Niveau d'études</label>
                  <div className="f-select-wrap">
                    <select className="f-input" value={form.niveau} onChange={e => set('niveau', e.target.value)}>
                      <option value="">Sélectionner votre niveau d'études</option>
                      {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="f-field full">
                  <label className="f-label">École(s) ou établissement(s)</label>
                  <input className="f-input" type="text" value={form.ecoles} onChange={e => set('ecoles', e.target.value)} placeholder="Ex : UAC, Sciences Po Paris, HEC..." />
                </div>

                <div className="f-sep"></div>

                {/* Expertise */}
                <div className="f-section-label">Expertise</div>
                <div className="f-field full">
                  <label className="f-label">Domaines d'expertise <span style={{ fontSize: 10, opacity: 0.5, letterSpacing: 0, textTransform: 'none' }}>(plusieurs choix possibles)</span></label>
                  <div className="f-domains-grid">
                    {DOMAINES.map((d, i) => (
                      <div key={d} className="f-check">
                        <input type="checkbox" id={`d${i}`} checked={form.domaines.includes(d)} onChange={() => toggleDomaine(d)} />
                        <label htmlFor={`d${i}`}>{d}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="f-field full">
                  <label className="f-label">Statut professionnel</label>
                  <div className="f-radio-grid">
                    {STATUTS.map((s, i) => (
                      <div key={s} className="f-radio">
                        <input type="radio" id={`st${i}`} name="statut" checked={form.statut === s} onChange={() => set('statut', s)} />
                        <label htmlFor={`st${i}`}>{s}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="f-field full">
                  <label className="f-label">Titre / Intitulé de poste occupé</label>
                  <input className="f-input" type="text" value={form.poste} onChange={e => set('poste', e.target.value)} placeholder="Ex : Directeur financier, Ingénieur logiciel, Consultant..." />
                </div>
                <div className="f-field full">
                  <label className="f-label">Entreprise ou organisation actuelle</label>
                  <input className="f-input" type="text" value={form.entreprise} onChange={e => set('entreprise', e.target.value)} placeholder="Votre employeur, structure ou activité principale" />
                </div>
                <div className="f-field full">
                  <label className="f-label">Profil LinkedIn</label>
                  <input className="f-input" type="text" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/votre-profil" />
                </div>

                {/* Privacy */}
                <div className="f-privacy full">
                  <div className="f-privacy-header">
                    <span>🔒</span>
                    <span className="f-privacy-title">Vos données &amp; votre vie privée</span>
                  </div>
                  <div className="f-privacy-body">
                    <p>En remplissant ce formulaire, vous acceptez que les informations fournies (pays de résidence, domaine d'expertise, niveau d'études, statut, tranche d'âge, titre de poste) soient intégrées à la Cartographie des Talents Béninois, accessible publiquement en ligne.</p>
                    <div className="f-privacy-items">
                      <div className="f-privacy-item"><span className="f-privacy-lbl">Finalité</span>Valorisation collective des compétences de la diaspora et des professionnels béninois, sans visée commerciale.</div>
                      <div className="f-privacy-item"><span className="f-privacy-lbl">Anonymat</span>Aucun nom, prénom ou contact n'est publié. Seules des données catégorielles sont affichées.</div>
                      <div className="f-privacy-item"><span className="f-privacy-lbl">Conservation</span>Les données sont conservées tant que la cartographie est active, ou jusqu'à votre demande de retrait.</div>
                      <div className="f-privacy-item"><span className="f-privacy-lbl">Vos droits</span>Vous pouvez à tout moment demander la modification ou la suppression de votre profil en écrivant à <a href="mailto:lavisionafrique@gmail.com" className="f-privacy-link">lavisionafrique@gmail.com</a></div>
                      <div className="f-privacy-item"><span className="f-privacy-lbl">Responsable</span>Laurent DJIDJOHO — Acteur de l'attractivité territoriale du Bénin.</div>
                    </div>
                  </div>
                </div>

                {error && <div className="f-error">{error}</div>}

                <div className="f-submit-area">
                  <button className="f-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Soumettre ma fiche'}
                  </button>
                  <p className="f-submit-note">Vos données sont utilisées exclusivement dans le cadre de cette cartographie nationale.</p>
                </div>

              </div>

              <footer className="f-footer">Bénin · Laurent Djidjoho · Cartographie Nationale des Talents · 2026</footer>
            </>
          )}
        </div>
      </div>
    </>
  );
}
