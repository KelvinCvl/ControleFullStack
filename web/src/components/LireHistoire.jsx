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

  useEffect(() => {
    const loadDebut = async () => {
      try {
        const res = await fetch(`http://localhost:5000/histoire/${histoireId}/debut`);
        if (!res.ok) throw new Error("Histoire non trouvée ou non publiée");
        const data = await res.json();
        setHistoire(data.histoire);
        setPage(data.page);
        chargerChoix(data.page.id);
        setLoading(false);
      } catch {
        alert("Impossible de charger cette histoire");
        navigate("/toutes-histoires");
      }
    };
    loadDebut();
  }, [histoireId, navigate]);

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

  useEffect(() => {
    if (page?.isEnd === 1) {
      console.log("🎯 Page de fin détectée");
      const userStr = localStorage.getItem("user");
      console.log("📦 User string récupéré:", userStr);
      
      if (!userStr) {
        console.warn("⚠️ Aucun utilisateur dans localStorage");
        return;
      }
      
      const user = JSON.parse(userStr);
      console.log("👤 User parsé:", user);
      console.log("🔍 user.id:", user?.id);
      
      if (!user?.id) {
        console.warn("⚠️ Pas d'ID utilisateur");
        return;
      }
      
      enregistrerStatistique(user.id);
    }
  }, [page]);

  const enregistrerStatistique = async (utilisateur_id) => {
    try {
      // ✅ Convertir histoireId en nombre
      const histoire_id = parseInt(histoireId, 10);
      const pagefinale_id = page.id;

      const payload = {
        utilisateur_id: utilisateur_id,
        histoire_id: histoire_id,
        pagefinale_id: pagefinale_id,
      };

      console.log("📤 Envoi des statistiques:");
      console.log("  - utilisateur_id:", utilisateur_id, "type:", typeof utilisateur_id);
      console.log("  - histoire_id:", histoire_id, "type:", typeof histoire_id);
      console.log("  - pagefinale_id:", pagefinale_id, "type:", typeof pagefinale_id);
      console.log("📦 Payload complet:", payload);

      const res = await fetch("http://localhost:5000/statistiques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📥 Status réponse:", res.status);
      const data = await res.json();
      console.log("📦 Réponse serveur:", data);

      if (!res.ok) {
        console.error("❌ Erreur serveur:", data);
      } else {
        console.log("✅ Statistique enregistrée avec succès!");
      }
    } catch (err) {
      console.error("❌ Erreur fetch:", err);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  const estFin = page?.isEnd === 1;

  return (
    <div className="lire-container">
      <h1 className="titre-histoire">{histoire?.titre}</h1>
      <div className="page-card">
        <div className="texte-page">{page?.texte}</div>
        {estFin ? (
          <div className="fin-histoire">
            <h2>✨ Fin de l'histoire ✨</h2>
            <p>Merci d'avoir joué !</p>
          </div>
        ) : (
          <div className="choix-liste">
            {choix.map((c) => (
              <button key={c.id} className="btn-choix" onClick={() => allerVersPage(c.next_page_id)}>
                → {c.texte}
              </button>
            ))}
          </div>
        )}
        <div className="actions-bas">
          <button onClick={() => navigate("/toutes-histoires")} className="btn-quitter">
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}