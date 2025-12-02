import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/LireHistoire.css";

export default function LireHistoire() {
  const { histoireId } = useParams();
  const navigate = useNavigate();

  const [histoire, setHistoire] = useState(null);
  const [page, setPage] = useState(null);
  const [choix, setChoix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedPageId, setSavedPageId] = useState(null);
  const [statsParcours, setStatsParcours] = useState(null);

  useEffect(() => {
    const loadDebut = async () => {
      try {
        const res = await fetch(`http://localhost:5000/histoire/${histoireId}/debut`);
        if (!res.ok) throw new Error("Histoire non trouvée ou non publiée");
        const data = await res.json();
        setHistoire(data.histoire);

        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const progressRes = await fetch(
            `http://localhost:5000/progression/${user.id}/${histoireId}`
          );
          const progressData = await progressRes.json();

          if (progressData.lastPageId) {
            setSavedPageId(progressData.lastPageId);
            setShowResumePrompt(true);
            setPage(data.page);
            chargerChoix(data.page.id);
          } else {
            setPage(data.page);
            chargerChoix(data.page.id);
          }
        } else {
          setPage(data.page);
          chargerChoix(data.page.id);
        }

        setLoading(false);
      } catch {
        alert("Impossible de charger cette histoire");
        navigate("/toutes-histoires");
      }
    };
    loadDebut();
  }, [histoireId, navigate]);

  const commencerDuDebut = async () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      await fetch("http://localhost:5000/progression/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utilisateur_id: user.id,
          histoire_id: parseInt(histoireId, 10),
        }),
      });
    }
    setShowResumePrompt(false);
  };

  const reprendreProgression = async () => {
    if (!savedPageId) return;
    
    try {
      const res = await fetch(`http://localhost:5000/page/public/${savedPageId}`);
      const data = await res.json();
      setPage(data.page);
      setChoix(data.choix);
      setShowResumePrompt(false);
    } catch {
      alert("Erreur de chargement de la progression");
      setShowResumePrompt(false);
    }
  };

  const chargerChoix = async (pageId) => {
    try {
      const res = await fetch(`http://localhost:5000/page/choix/public/page/${pageId}`);
      const data = await res.json();
      setChoix(data);
    } catch {
      setChoix([]);
    }
  };

  const allerVersPage = async (nextPageId) => {
    if (!nextPageId) return;
    try {
      const res = await fetch(`http://localhost:5000/page/public/${nextPageId}`);
      const data = await res.json();
      setPage(data.page);
      setChoix(data.choix);
    } catch {
      alert("Erreur de chargement de la nouvelle page");
    }
  };

  // Charger les stats de parcours quand on arrive à une fin
  useEffect(() => {
    if (!page?.id) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    if (!user?.id) return;

    const enregistrerProgression = async () => {
      try {
        if (page.isEnd === 1) {
          // Enregistrer la fin et charger les stats
          await fetch("http://localhost:5000/stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              utilisateur_id: user.id,
              histoire_id: parseInt(histoireId, 10),
              pagefinale_id: page.id,
            }),
          });

          // Charger les statistiques de parcours
          const statsRes = await fetch(
            `http://localhost:5000/stats/parcours/${histoireId}/${page.id}`
          );
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStatsParcours(statsData);
          }

          // Réinitialiser la progression
          await fetch("http://localhost:5000/progression/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              utilisateur_id: user.id,
              histoire_id: parseInt(histoireId, 10),
            }),
          });
        } else {
          await fetch("http://localhost:5000/progression", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              utilisateur_id: user.id,
              histoire_id: parseInt(histoireId, 10),
              page_id: page.id,
            }),
          });
        }
      } catch (err) {
        console.error("Erreur sauvegarde progression:", err);
      }
    };

    enregistrerProgression();
  }, [page, histoireId]);

  if (loading) return <div className="loading">Chargement...</div>;

  const estFin = page?.isEnd === 1;

  return (
    <div className="lire-container">
      {showResumePrompt && (
        <div className="resume-modal">
          <div className="resume-content">
            <h3>📖 Reprendre la lecture ?</h3>
            <p>Vous avez une progression sauvegardée pour cette histoire.</p>
            <div className="resume-buttons">
              <button onClick={reprendreProgression} className="btn-resume">
                Reprendre où j'en étais
              </button>
              <button onClick={commencerDuDebut} className="btn-restart">
                Recommencer du début
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h1 className="titre-histoire">{histoire?.titre}</h1>
          {histoire?.theme && (
            <p style={{ color: "#7f8c8d", fontSize: "0.95rem", marginTop: "0.5rem" }}>
              🏷️ <strong>Thème:</strong> {histoire.theme}
            </p>
          )}
          {histoire?.auteur && (
            <p style={{ color: "#95a5a6", fontSize: "0.9rem", marginTop: "0.3rem" }}>
              📝 Par: {histoire.auteur}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/home")}
          className="btn-quitter"
          style={{ height: "fit-content", padding: "0.75rem 1rem" }}
        >
          ← Retour
        </button>
      </div>
      <div className="page-card">
        <div className="texte-page">{page?.texte}</div>

        {estFin ? (
          <div className="fin-histoire">
            <h2>✨ Fin de l'histoire ✨</h2>
            <p>Merci d'avoir joué !</p>

            {statsParcours && (
              <div className="stats-fin">
                <div className="stat-box">
                  <h3>📊 Statistiques de votre parcours</h3>
                  <p className="stat-item">
                    🎯 <strong>Vous avez pris le même chemin que {statsParcours.pourcentageJoueurs}% des joueurs</strong>
                  </p>
                  
                  <h4>Répartition des fins :</h4>
                  <div className="repartition">
                    {Object.entries(statsParcours.repartitionFins).map(([nomFin, data]) => (
                      <div key={nomFin} className="fin-stat">
                        <span>{nomFin}: {data.percentage}%</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${data.percentage}%`}}
                          ></div>
                        </div>
                        <small>({data.count} partie{data.count > 1 ? 's' : ''})</small>
                      </div>
                    ))}
                  </div>
                  <p className="total-parties">
                    📈 Total parties jouées : <strong>{statsParcours.totalParties}</strong>
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                commencerDuDebut();
                setStatsParcours(null);
                window.location.reload();
              }}
              className="btn-rejouer"
            >
              🔄 Rejouer
            </button>
          </div>
        ) : (
          <div className="choix-liste">
            {choix.map((c) => (
              <button
                key={c.id}
                className="btn-choix"
                onClick={() => allerVersPage(c.next_page_id)}
              >
                → {c.texte}
              </button>
            ))}
          </div>
        )}

        <div className="actions-bas">
          <button
            onClick={() => navigate("/home")}
            className="btn-quitter"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}