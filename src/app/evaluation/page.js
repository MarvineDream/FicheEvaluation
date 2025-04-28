"use client";

import { useState } from "react";

const BACKEND_URL = "https://backendeva.onrender.com/Evaluation";

export default function EvaluationPage() {
  // États
  const [agent, setAgent] = useState({
    nom: "", prenom: "", emploi: "", direction: "", typeContrat: "", dateEmbauche: "", dateDebutCDD: "", dateFinCDD: "", dureeCDD: ""
  });

  const [objectifs, setObjectifs] = useState([
    { activite: "", attendu: "", realise: "", indicateur: "", pourcentageAtteinte: "", commentaires: "" }
  ]);

  const [integration, setIntegration] = useState([
    { critere: "Adaptation au poste", note: "", commentaire: "" },
    { critere: "Adaptation à l'équipe", note: "", commentaire: "" },
    { critere: "Respect des procédures", note: "", commentaire: "" },
    { critere: "Maîtrise des outils", note: "", commentaire: "" }
  ]);

  const [competences, setCompetences] = useState({
    savoir: [
      { critere: "Connaissance des procédures", note: "", axeAmelioration: "" },
      { critere: "Connaissance du processus", note: "", axeAmelioration: "" },
      { critere: "Connaissance des logiciels d'exploitation", note: "", axeAmelioration: "" },
      { critere: "Connaissance technique bancaire", note: "", axeAmelioration: "" }
    ],
    savoirFaire: [
      { critere: "Organisation du travail", note: "", axeAmelioration: "" },
      { critere: "Fiabilité des tâches", note: "", axeAmelioration: "" },
      { critere: "Respect des délais", note: "", axeAmelioration: "" }
    ],
    savoirEtre: [
      { critere: "Autonomie", note: "", axeAmelioration: "" },
      { critere: "Implication", note: "", axeAmelioration: "" },
      { critere: "Ponctualité", note: "", axeAmelioration: "" }
    ],
    discipline: [
      { critere: "Respect du règlement intérieur", note: "", axeAmelioration: "" },
      { critere: "Respect de la charte informatique", note: "", axeAmelioration: "" }
    ]
  });

  const [appreciationGlobale, setAppreciationGlobale] = useState("");
  const [decision, setDecision] = useState({ choix: "", commentaire: "" });
  const [signatures, setSignatures] = useState({ responsableNom: "", responsableDate: "", rhNom: "", rhDate: "" });
  const [showPreview, setShowPreview] = useState(false);

  // Handlers
  const handleChange = (e, setFunc, state) => {
    const { name, value } = e.target;
    setFunc({ ...state, [name]: value });
  };

  const handleArrayChange = (index, e, array, setArray) => {
    const { name, value } = e.target;
    const updated = [...array];
    updated[index][name] = value;
    setArray(updated);
  };

  const handleNestedArrayChange = (e, section, index) => {
    const { name, value } = e.target;
    const updated = { ...competences };
    updated[section][index][name] = value;
    setCompetences(updated);
  };

  const addObjectif = () => {
    setObjectifs([...objectifs, { activite: "", attendu: "", realise: "", indicateur: "", pourcentageAtteinte: "", commentaires: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, objectifs, integration, competences, appreciationGlobale, decision, signatures })
      });
      if (!res.ok) throw new Error("Erreur");
      alert("✅ Fiche d'évaluation envoyée !");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Erreur d'envoi");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 sticky top-0">
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <ul>
          <li className="mb-2">
            <a href="#" className="hover:underline">Formulaire d Évaluation</a>
          </li>
          {/* Ajoutez d'autres liens ici si nécessaire */}
        </ul>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 bg-gray-100 min-h-screen p-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl mx-auto">

          {/* Informations de l'agent */}
          <Section title="Informations de l'agent">
            <Grid2>
              {["nom", "prenom", "emploi", "direction", "typeContrat", "dureeCDD"].map((field) => (
                <Input key={field} name={field} value={agent[field]} onChange={(e) => handleChange(e, setAgent, agent)} />
              ))}
              {["dateEmbauche", "dateDebutCDD", "dateFinCDD"].map((field) => (
                <Input key={field} type="date" name={field} value={agent[field]} onChange={(e) => handleChange(e, setAgent, agent)} placeholder={`Entrez la ${field}`} />
              ))}
            </Grid2>
          </Section>

          {/* Objectifs fixés */}
          <Section title="Objectifs fixés">
            {objectifs.map((obj, idx) => (
              <div key={idx} className="space-y-2">
                <Grid2>
                  {["activite", "attendu", "realise", "indicateur", "pourcentageAtteinte"].map((field) => (
                    <Input key={field} name={field} value={obj[field]} onChange={(e) => handleArrayChange(idx, e, objectifs, setObjectifs)} />
                  ))}
                </Grid2>
                <textarea
                  name="commentaires"
                  placeholder="Commentaires"
                  value={obj.commentaires}
                  onChange={(e) => handleArrayChange(idx, e, objectifs, setObjectifs)}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
            ))}
            <button type="button" onClick={addObjectif} className="bg-green-500 text-white py-2 px-4 rounded mt-4">➕ Ajouter Objectif</button>
          </Section>

          {/* Intégration professionnelle */}
          <Section title="Intégration professionnelle">
            {integration.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="font-semibold">{item.critere}</h4>
                <SelectNote name="note" value={item.note} onChange={(e) => handleArrayChange(idx, e, integration, setIntegration)} />
                <textarea
                  name="commentaire"
                  placeholder="Commentaire"
                  value={item.commentaire}
                  onChange={(e) => handleArrayChange(idx, e, integration, setIntegration)}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
            ))}
          </Section>

          {/* Compétences professionnelles */}
          <Section title="Compétences professionnelles">
  {Object.entries(competences).map(([category, items]) => (
    <div key={category} className="space-y-4">
      <h3 className="text-xl font-bold">{category.toUpperCase()}</h3>
      {items.map((item, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border p-4 rounded bg-white">
          <p className="font-medium">{item.critere}</p> {/* Le critère bien visible */}
          <SelectNote
            name="note"
            value={item.note}
            onChange={(e) => handleNestedArrayChange(e, category, idx)}
          />
          <Input
            name="axeAmelioration"
            value={item.axeAmelioration}
            onChange={(e) => handleNestedArrayChange(e, category, idx)}
            placeholder="Axe d'amélioration"
          />
        </div>
      ))}
    </div>
  ))}
</Section>


          {/* Appréciation Globale */}
          <Section title="Appréciation Globale">
            <textarea
              name="appreciationGlobale"
              placeholder="Exprimez votre appréciation globale"
              value={appreciationGlobale}
              onChange={(e) => setAppreciationGlobale(e.target.value)}
              className="border px-3 py-2 rounded w-full h-32"
            />
          </Section>

          {/* Décision RH */}
          <Section title="Décision RH">
            <SelectDecision decision={decision} setDecision={setDecision} />
            <textarea
              name="commentaire"
              placeholder="Commentaire décision RH"
              value={decision.commentaire}
              onChange={(e) => setDecision({ ...decision, commentaire: e.target.value })}
              className="border px-3 py-2 rounded w-full h-24"
            />
          </Section>

          {/* Signatures */}
          <Section title="Signatures">
            <Grid2>
              <Input name="responsableNom" placeholder="Nom Responsable" value={signatures.responsableNom} onChange={(e) => handleChange(e, setSignatures, signatures)} />
              <Input type="date" name="responsableDate" value={signatures.responsableDate} onChange={(e) => handleChange(e, setSignatures, signatures)} />
              <Input name="rhNom" placeholder="Nom RH" value={signatures.rhNom} onChange={(e) => handleChange(e, setSignatures, signatures)} />
              <Input type="date" name="rhDate" value={signatures.rhDate} onChange={(e) => handleChange(e, setSignatures, signatures)} />
            </Grid2>
          </Section>

          {/* Boutons */}
          <div className="flex justify-center gap-6 mt-8">
            <button type="button" onClick={() => setShowPreview(true)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full">
              👀 Prévisualiser
            </button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full">
              ✅ Envoyer
            </button>
          </div>
        </form>

        {/* Aperçu Modal */}
        {showPreview && (
          <PreviewModal
            agent={agent}
            objectifs={objectifs}
            integration={integration}
            competences={competences}
            appreciationGlobale={appreciationGlobale}
            decision={decision}
            signatures={signatures}
            setShowPreview={setShowPreview}
          />
        )}
      </main>
    </div>
  );
}

// 🧩 Composants internes
const Section = ({ title, children }) => (
  <section className="space-y-4 border-t border-gray-300 pt-8">
    <h2 className="text-2xl font-bold">{title}</h2>
    {children}
  </section>
);

const Grid2 = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ name, value, onChange, type = "text", placeholder }) => (
  <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder || name} className="border px-3 py-2 rounded w-full" />
);

const SelectNote = ({ name, value, onChange }) => (
  <select name={name} value={value} onChange={onChange} className="border px-3 py-2 rounded w-full">
    <option value="">Sélectionner une note</option>
    <option value="TB">Très Bien</option>
    <option value="B">Bien</option>
    <option value="P">Passable</option>
    <option value="I">Insuffisant</option>
    <option value="PC">Pas Concerné</option>
  </select>
);

const SelectDecision = ({ decision, setDecision }) => (
  <select value={decision.choix} onChange={(e) => setDecision({ ...decision, choix: e.target.value })} className="border px-3 py-2 rounded w-full">
    <option value="">Sélectionner une décision</option>
    <option value="Confirmer la période d'essai">Confirmer la période d essai</option>
    <option value="Prolonger la période d'essai">Prolonger la période d essai</option>
    <option value="Rupture du contrat">Rupture du contrat</option>
  </select>
);

const PreviewModal = ({ agent, objectifs, integration, competences, appreciationGlobale, decision, signatures, setShowPreview }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-md 
      transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-6 text-center">Aperçu de la fiche d évaluation</h2>

      <div className="space-y-6 text-gray-800 text-sm">
        <SectionPreview title="Informations de l'agent">{Object.entries(agent).map(([k, v]) => <p key={k}><strong>{k}</strong> : {v}</p>)}</SectionPreview>
        <SectionPreview title="Objectifs fixés">{objectifs.map((obj, i) => <p key={i}><strong>Activité :</strong> {obj.activite} - <strong>% :</strong> {obj.pourcentageAtteinte}%</p>)}</SectionPreview>
        <SectionPreview title="Intégration">{integration.map((item, i) => <p key={i}><strong>{item.critere}</strong> : {item.note}</p>)}</SectionPreview>
        <SectionPreview title="Compétences">{Object.entries(competences).map(([cat, items]) => (
          <div key={cat}><strong>{cat.toUpperCase()}</strong>{items.map((item, i) => <p key={i}>{item.critere} - {item.note}</p>)}</div>
        ))}</SectionPreview>
        <SectionPreview title="Appréciation Globale"><p>{appreciationGlobale}</p></SectionPreview>
        <SectionPreview title="Décision RH"><p>{decision.choix}</p><p>{decision.commentaire}</p></SectionPreview>
        <SectionPreview title="Signatures"><p>Responsable: {signatures.responsableNom} / {signatures.responsableDate}</p><p>RH: {signatures.rhNom} / {signatures.rhDate}</p></SectionPreview>
      </div>

      <div className="flex justify-center mt-6">
        <button onClick={() => setShowPreview(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full">
          🔙 Modifier
        </button>
      </div>

      <button onClick={() => setShowPreview(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl">&times;</button>
    </div>
  </div>
);

const SectionPreview = ({ title, children }) => (
  <div className="border-t border-gray-300 pt-4">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    {children}
  </div>
);
