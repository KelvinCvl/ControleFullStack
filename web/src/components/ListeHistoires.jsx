import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ListeHistoires.css";

function ListeHistoires() {
  const [histoires, setHistoires] = useState([]);
  const [avisData, setAvisData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchHistoires = async () => {
      try {
        const res = await fetch("http://localhost:5000/histoire/publiques");
        const data = await res.json();
        setHistoires(data);

        const avisPromises = data.map(async (h) => {
          try {
            const res = await fetch(`http://localhost:5000/avis/histoire/${h.id}`);
            if (!res.ok) {
              console.error(`Erreur pour histoire ${h.id}:`, res.status);
              return [h.id, { moyenne: 0, total: 0 }];
            }
            const avis = await res.json();
            return [h.id, avis];
          } catch (err) {
            console.error(`Erreur avis histoire ${h.id}:`, err);
            return [h.id, { moyenne: 0, total: 0 }];
          }
        });

        const avisArray = await Promise.all(avisPromises);
        const avisObj = Object.fromEntries(avisArray);
        setAvisData(avisObj);

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement");
        setLoading(false);
      }
    };

    fetchHistoires();
  }, [navigate]); 

  const donnerAvis = async (histoireId, note) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) return;
    
    try {
      const res = await fetch("http://localhost:5000/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utilisateur_id: user.id,
          histoire_id: histoireId,
          note,
        }),
      });
      const data = await res.json();
      setAvisData((prev) => ({ ...prev, [histoireId]: data }));
    } catch (err) {
      console.error(err);
      alert("Impossible d'envoyer votre avis");
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="toutes-container">
      <h1>Toutes les histoires publiées</h1>
      <div className="histoires-grid">
        {histoires.map((h) => (
          <div key={h.id} className="histoire-card">
            <h2>{h.titre}</h2>
            <p className="auteur">par {h.auteur || "Anonyme"}</p>

            {avisData[h.id] && (
              <p>
                Note moyenne : {avisData[h.id].moyenne.toFixed(1)} / 5 (
                {avisData[h.id].total} avis)
              </p>
            )}

            <div className="donner-avis">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => donnerAvis(h.id, n)}>
                  {n} ⭐
                </button>
              ))}
            </div>

            <button
              className="btn-lire"
              onClick={() => navigate(`/lire-histoire/${h.id}`)}
            >
              Lire l'histoire
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListeHistoires;