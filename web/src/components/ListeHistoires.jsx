import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ListeHistoires.css";

export default function ListeHistoires() {
  const [histoires, setHistoires] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchHistoires = fetch("http://localhost:5000/histoire/publiques").then((res) =>
      res.json()
    );

    const fetchStats = fetch(`http://localhost:5000/stats/utilisateur/${user.id}`).then((res) =>
      res.json()
    );

    Promise.all([fetchHistoires, fetchStats])
      .then(([histData, statsData]) => {
        setHistoires(histData);
        setStats(statsData); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch :", err);
        alert("Erreur lors du chargement");
        setLoading(false);
      });
  }, [navigate, user]);

  if (loading) return <div className="loading">Chargement des histoires...</div>;

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

              {stats[h.id]?.finsAtteintes?.length > 0 && (
                <p className="fins-user">
                  Fins atteintes :{" "}
                  {stats[h.id].finsAtteintes
                    .map((f) => f.typeFin)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

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
