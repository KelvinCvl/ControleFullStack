// web/src/components/CreerHistoire.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreerHistoire.css";

export default function CreerHistoire() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [themesDisponibles, setThemesDisponibles] = useState([]);
  const [nouveauTheme, setNouveauTheme] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Charger les thèmes existants au démarrage
  useEffect(() => {
    fetch("http://localhost:5000/histoire/themes")
      .then(res => res.json())
      .then(data => {
        const themesUniques = data.map(item => item.theme).filter(Boolean);
        setThemesDisponibles(themesUniques);
      })
      .catch(err => console.error("Erreur chargement thèmes:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Vous devez être connecté.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/histoire/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          titre,
          description,
          theme: theme || nouveauTheme || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || data.message || "Erreur.");
        return;
      }

      // redirige vers l'édition / modification
      navigate(`/modifier-histoire/${data.id}`);
    } catch (error) {
      console.error("Erreur création :", error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div className="creer-container">
      <h1>Créer une histoire</h1>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="form-creer-histoire">
        <input
          type="text"
          className="input"
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />

        <textarea
          className="textarea"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label htmlFor="theme-select" style={{ marginTop: "1rem", display: "block" }}>
          <strong>Thème</strong>
        </label>
        <select
          id="theme-select"
          className="input"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="">-- Choisir un thème existant ou en créer un --</option>
          {themesDisponibles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="input"
          placeholder="Ou créer un nouveau thème..."
          value={nouveauTheme}
          onChange={(e) => setNouveauTheme(e.target.value)}
          disabled={theme !== ""}
        />

        <button type="submit" className="btn-creer">
          Créer
        </button>
      </form>
    </div>
  );
}
