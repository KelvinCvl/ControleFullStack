import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function GestionHistoire() {
  const { id: histoireId } = useParams(); // id de l'histoire
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [contenu, setContenu] = useState("");
  const [fin, setFin] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      if (!token) return;

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
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          histoire_id: histoireId,
          contenu,
          isEnd: fin,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPages([...pages, data]);
        setContenu("");
        setFin(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette page ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/page/${pageId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (res.ok) setPages(pages.filter((p) => p.id !== pageId));
      else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleEditPage = async (page) => {
    const nouveauContenu = prompt("Modifier le contenu de la page", page.contenu);
    if (nouveauContenu === null) return; // annuler

    const nouveauFin = window.confirm("Cette page est-elle une fin ?");

    try {
      const res = await fetch(`http://localhost:5000/page/${page.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          contenu: nouveauContenu,
          isEnd: nouveauFin,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPages(
          pages.map((p) =>
            p.id === page.id ? { ...p, contenu: nouveauContenu, isEnd: nouveauFin } : p
          )
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestion des pages</h1>

      <form onSubmit={handleCreatePage} style={{ marginBottom: "2rem" }}>
        <textarea
          placeholder="Contenu de la page"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
        />
        <label style={{ marginLeft: "0.5rem" }}>
          <input
            type="checkbox"
            checked={fin}
            onChange={(e) => setFin(e.target.checked)}
          />{" "}
          Page de fin
        </label>
        <button type="submit">Créer la page</button>
      </form>

      <h2>Pages existantes</h2>
      {pages.length === 0 ? (
        <p>Aucune page pour le moment</p>
      ) : (
        <ul>
          {pages.map((p, index) => (
            <li key={p.id} style={{ marginBottom: "1rem" }}>
              Page #{index + 1} — {p.isEnd ? "Fin" : "Non fin"}
              <button onClick={() => handleEditPage(p)} style={{ marginLeft: "0.5rem" }}>
                Modifier
              </button>
              <button onClick={() => handleDeletePage(p.id)} style={{ marginLeft: "0.5rem" }}>
                Supprimer
              </button>
              <button
                onClick={() => navigate(`/gestion-choix/${p.id}`)}
                style={{ marginLeft: "0.5rem" }}
              >
                Gérer les choix
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GestionHistoire;
