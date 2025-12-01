import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ListeHistoires.css";

export default function ListeHistoires() {
  const [histoires, setHistoires] = useState([]);
  const [themes, setThemes] = useState([]);
  const [themeSelectionne, setThemeSelectionne] = useState("");
  const [recherche, setRecherche] = useState("");
  const navigate = useNavigate();

  // Charger tous les thèmes
  useEffect(() => {
    fetch("http://localhost:5000/histoire/themes")
      .then(res => res.json())
      .then(data => {
        const themesUniques = data.map(item => item.theme).filter(Boolean);
        setThemes(themesUniques);
      })
      .catch(err => console.error("Erreur chargement thèmes:", err));
  }, []);

  // Charger les histoires en fonction du filtre
  useEffect(() => {
    let url = "http://localhost:5000/histoire/publiques";
    
    if (themeSelectionne) {
      url = `http://localhost:5000/histoire/theme/${encodeURIComponent(themeSelectionne)}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let filtered = data;
        if (recherche) {
          filtered = data.filter(h =>
            h.titre.toLowerCase().includes(recherche.toLowerCase()) ||
            h.description?.toLowerCase().includes(recherche.toLowerCase())
          );
        }
        setHistoires(filtered);
      })
      .catch(err => console.error("Erreur chargement histoires:", err));
  }, [themeSelectionne, recherche]);

  return (
    <div className="liste-container">
      <div style={{ marginBottom: "1rem" }}>
        <button 
          onClick={() => navigate("/home")} 
          className="create-button"
          style={{ background: "#3498db" }}
        >
          ← Retour à l'accueil
        </button>
      </div>
      <h1>📚 Toutes les Histoires</h1>

      <div className="filtres">
        <input
          type="text"
          placeholder="🔍 Rechercher une histoire..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="search-input"
        />

        <select
          value={themeSelectionne}
          onChange={(e) => setThemeSelectionne(e.target.value)}
          className="theme-filter"
        >
          <option value="">Tous les thèmes</option>
          {themes.map((theme, idx) => (
            <option key={`theme-${idx}`} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>

      {histoires.length === 0 ? (
        <p className="no-results">Aucune histoire trouvée</p>
      ) : (
        <div className="histoires-grid">
          {histoires.map((histoire, idx) => (
            <div key={`histoire-${histoire.id}-${idx}`} className="histoire-card">
              <h3>{histoire.titre}</h3>
              {histoire.theme && <span className="theme-badge">🏷️ {histoire.theme}</span>}
              <p className="auteur">Par: {histoire.auteur || "Anonyme"}</p>
              <p className="description">{histoire.description || "Pas de description"}</p>
              <button
                onClick={() => navigate(`/lire/${histoire.id}`)}
                className="lire-button"
              >
                📖 Lire l'histoire
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
