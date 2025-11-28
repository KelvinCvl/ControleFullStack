import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/GestionHistoire.css";

function GestionHistoire() {
  const { id: histoireId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [contenu, setContenu] = useState("");
  const [fin, setFin] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchPages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/page/${histoireId}`, {
          headers: { Authorization: token },
        });
        if (!res.ok) throw new Error("Impossible de charger les pages");
        const data = await res.json();
        setPages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPages();
  }, [histoireId, token]);

  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!contenu) return alert("Le contenu est requis");

    try {
      const res = await fetch("http://localhost:5000/page", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ histoire_id: histoireId, contenu, isEnd: fin }),
      });

      const data = await res.json();
      if (res.ok) {
        setPages([...pages, data]);
        setContenu("");
        setFin(false);
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleDeletePage = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette page ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/page/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (res.ok) setPages(pages.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleEditPage = async (page) => {
    const nouveauContenu = prompt("Modifier le contenu de la page", page.contenu);
    if (nouveauContenu === null) return;
    const nouveauFin = window.confirm("Cette page est-elle une fin ?");

    try {
      const res = await fetch(`http://localhost:5000/page/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ contenu: nouveauContenu, isEnd: nouveauFin }),
      });
      if (res.ok) {
        setPages(pages.map((p) => p.id === page.id ? { ...p, contenu: nouveauContenu, isEnd: nouveauFin } : p));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="gestion-container">
      <h1>Gestion des pages</h1>

      <form className="gestion-form" onSubmit={handleCreatePage}>
        <textarea
          className="gestion-textarea"
          placeholder="Contenu de la page"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
        />
        <label className="gestion-label">
          <input type="checkbox" checked={fin} onChange={(e) => setFin(e.target.checked)} />
          Page de fin
        </label>
        <button type="submit" className="gestion-button">Créer la page</button>
      </form>

      <h2>Pages existantes</h2>
      {pages.length === 0 ? (
        <p>Aucune page pour le moment</p>
      ) : (
        <ul className="gestion-list">
          {pages.map((p, i) => (
            <li key={p.id} className="gestion-item">
              <span className="page-info">Page #{i+1} — {p.isEnd ? "Fin" : "Non fin"}</span>
              <div className="actions">
                <button onClick={() => handleEditPage(p)}>Modifier</button>
                <button onClick={() => handleDeletePage(p.id)}>Supprimer</button>
                <button onClick={() => navigate(`/gestion-choix/${p.id}`)}>Gérer les choix</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className="back-button" onClick={() => navigate(`/modifier-histoire/${histoireId}`)}>Retour</button>
    </div>
  );
}

export default GestionHistoire;
