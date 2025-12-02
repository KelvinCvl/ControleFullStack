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

  const [showSignalModal, setShowSignalModal] = useState(false);
  const [raisonSignalement, setRaisonSignalement] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationSignalement, setConfirmationSignalement] = useState("");

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
    window.location.reload();
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

  useEffect(() => {
    if (!page?.id) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    if (!user?.id) return;

    const enregistrerProgression = async () => {
      try {
        if (page.isEnd === 1) {
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

  const envoyerSignalement = async () => {
    console.log('🔵 Début envoi signalement');
    
    if (isSubmitting) {
      console.log('⚠️ Déjà en cours d\'envoi');
      return;
    }
    
    if (!raisonSignalement.trim()) {
      console.log('⚠️ Raison vide');
      setConfirmationSignalement("Veuillez indiquer une raison de signalement.");
      setTimeout(() => setConfirmationSignalement(""), 3000);
      return;
    }

    setIsSubmitting(true);
    console.log('🔵 isSubmitting = true');
    
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      const payload = {
        histoire_id: parseInt(histoireId, 10),
        utilisateur_id: user?.id || null,
        raison: raisonSignalement,
      };
      
      console.log('📤 Envoi payload:', payload);

      const res = await fetch("http://localhost:5000/signaler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log('📥 Réponse reçue:', res.status, res.statusText);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.log('❌ Erreur serveur:', errData);
        throw new Error(errData.message || "Erreur serveur");
      }

      const data = await res.json();
      console.log('✅ Succès:', data);

      setConfirmationSignalement("✅ Signalement envoyé avec succès !");
      setRaisonSignalement("");
      
      setTimeout(() => {
        console.log('🔵 Fermeture modal');
        setShowSignalModal(false);
        setConfirmationSignalement("");
      }, 2000);
      
    } catch (err) {
      console.error('❌ Erreur catch:', err);
      setConfirmationSignalement("❌ Erreur lors de l'envoi : " + err.message);
      setTimeout(() => setConfirmationSignalement(""), 3000);
    } finally {
      console.log('🔵 isSubmitting = false');
      setIsSubmitting(false);
    }
  };

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

      <h1 className="titre-histoire">{histoire?.titre}</h1>

      <div className="page-card">
        <div className="texte-page">{page?.texte}</div>

        {estFin ? (
          <div className="fin-histoire">
            <h2>✨ Fin de l'histoire ✨</h2>
            <p>Merci d'avoir joué !</p>
            <button onClick={commencerDuDebut} className="btn-rejouer">
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
          <button onClick={() => navigate("/toutes-histoires")} className="btn-quitter">
            Quitter
          </button>
        </div>
      </div>

      <div className="btn-container-signal">
        <button className="btn-signaler" onClick={() => setShowSignalModal(true)}>
          🚨 Signaler l'histoire
        </button>
      </div>

      {showSignalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🚨 Signaler l'histoire</h3>
            
            {confirmationSignalement && (
              <div className={`modal-message ${confirmationSignalement.includes('✅') ? 'success' : 'error'}`}>
                {confirmationSignalement}
              </div>
            )}
            
            <textarea
              placeholder="Expliquez la raison du signalement..."
              value={raisonSignalement}
              onChange={(e) => setRaisonSignalement(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="modal-buttons">
              <button
                onClick={envoyerSignalement}
                className="btn-envoyer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </button>
              <button
                onClick={() => {
                  setShowSignalModal(false);
                  setConfirmationSignalement("");
                  setRaisonSignalement("");
                }}
                className="btn-fermer"
                disabled={isSubmitting}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}