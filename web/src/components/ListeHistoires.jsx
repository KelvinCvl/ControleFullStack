import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ListeHistoires.css";

function ListeHistoires() {
  const [histoires, setHistoires] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/histoire/publiques")
      .then((res) => res.json())
      .then((data) => {
        setHistoires(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Erreur lors du chargement des histoires");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Chargement des histoires...</div>;
  }

  return (
    <div className="toutes-container">
      <h1>Toutes les histoires publiées</h1>

      {histoires.length === 0 ? (
        <p className="aucune">Aucune histoire publiée pour le moment.</p>
      ) : (
        <div className="histoires-grid">
          {histoires.map((h) => (
            <div key={h.id} className="histoire-card">
              <h2>{h.titre}</h2>
              <p className="auteur">par {h.auteur || "Anonyme"}</p>
              <button
                className="btn-lire"
                onClick={() => navigate(`/lire-histoire/${h.id}`)}
              >
                Lire l'histoire
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="btn-retour" onClick={() => navigate("/home")}>
        Retour à mon espace
      </button>
    </div>
  );
}

export default ListeHistoires;