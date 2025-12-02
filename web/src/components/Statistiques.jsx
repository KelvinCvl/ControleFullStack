import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Statistiques.css";

function Statistiques() {
  const { id } = useParams(); 
  const [statSimples, setStatSimples] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchStats();
  }, [id, token, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/stats/simples/${id}`, {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setStatSimples(data);
      } else {
        console.error("Erreur récupération stats", res.status);
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement des statistiques...</p>;
  if (!statSimples) return <p>Aucune statistique disponible</p>;

  return (
    <div className="home-container">
      <h1>📊 Statistiques de l'Histoire</h1>

      <div className="stats-container">
        {/* Statistiques simples */}
        <div className="stat-card">
          <h2>📈 Statistiques Globales</h2>
          
          <div className="stat-item">
            <h3>Nombre total de parties jouées</h3>
            <p className="stat-value">{statSimples.totalParties}</p>
          </div>

          <div className="stat-item">
            <h3>Fins atteintes par les joueurs</h3>
            <div className="fins-list">
              {Object.entries(statSimples.finsAtteintes).map(([nomFin, count]) => {
                const pourcentage = ((count / statSimples.totalParties) * 100).toFixed(1);
                return (
                  <div key={nomFin} className="fin-stat-card">
                    <div className="fin-header">
                      <span className="fin-name">{nomFin}</span>
                      <span className="fin-count">{count} partie{count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${pourcentage}%`}}
                        ></div>
                      </div>
                      <span className="pourcentage">{pourcentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <button 
        className="create-button" 
        onClick={() => navigate(-1)}
      >
        ← Retour
      </button>
    </div>
  );
}

export default Statistiques;
