import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/GestionChoix.css"

function GestionChoix() {
  const { pageId } = useParams(); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [choix, setChoix] = useState([]);
  const [texte, setTexte] = useState("");
  const [nextPageId, setNextPageId] = useState("");

  useEffect(() => {
    const fetchChoix = async () => {
      try {
        const res = await fetch(`http://localhost:5000/choix/page/${pageId}`, {
          headers: { Authorization: token },
        });

        if (!res.ok) throw new Error("Impossible de charger les choix");
        const data = await res.json();
        setChoix(data);
      } catch (err) {
        console.error(err);
        setChoix([]);
      }
    };

    fetchChoix();
  }, [pageId, token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!texte) {
      alert("Le texte du choix est requis");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/choix", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ page_id: pageId, texte, next_page_id: nextPageId || null }),
      });

      const data = await res.json();

      if (res.ok) {
        setChoix([...choix, data]);
        setTexte("");
        setNextPageId("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce choix ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/choix/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (res.ok) {
        setChoix(choix.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="gestion-choix-container">
      <h1>Gestion des choix de la page {pageId}</h1>

      <div className="gestion-card">
        <form onSubmit={handleCreate} className="choix-form">
          <input
            type="text"
            placeholder="Texte du choix"
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
          />
          <input
            type="text"
            placeholder="ID de la page suivante (laisser vide = fin)"
            value={nextPageId}
            onChange={(e) => setNextPageId(e.target.value)}
          />
          <button type="submit">Ajouter le choix</button>
        </form>

        <h2>Choix existants</h2>
        {choix.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>Aucun choix pour cette page</p>
        ) : (
          <ul className="choix-list">
            {choix.map((c) => (
              <li key={c.id} className="choix-item">
                <span>{c.texte}</span>
                <span className="page-dest">→ Page {c.next_page_id || "FIN"}</span>
                <button onClick={() => handleDelete(c.id)}>Supprimer</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => navigate(-1)} className="back-button">
        Retour
      </button>
    </div>
  );
}

export default GestionChoix;