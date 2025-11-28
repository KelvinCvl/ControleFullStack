import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/ModifierHistoire.css"

function ModifierHistoire() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [statut, setStatut] = useState("brouillon");
  const [pageDepart, setPageDepart] = useState("");
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchHistoire = async () => {
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/histoire/${id}`, {
          headers: { Authorization: token },
        });

        if (!res.ok) {
          console.error("Erreur HTTP", res.status);
          return;
        }

        const data = await res.json();
        setTitre(data.titre);
        setDescription(data.description);
        setStatut(data.statut);
        setPageDepart(data.pagedepart_id || "");
      } catch (err) {
        console.error("Erreur fetch:", err);
      }
    };

    const fetchPages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/page/${id}`, {
          headers: { Authorization: token },
        });

        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (err) {
        console.error("Erreur fetch pages:", err);
      }
    };

    fetchHistoire();
    fetchPages();
  }, [id, navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/histoire/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ titre, description, statut, pagedepart_id: pageDepart }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Histoire mise à jour !");
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
   <div className="modifier-container"> 
      <h1>Modifier l'histoire</h1>

      <form className="modifier-form" onSubmit={handleSubmit}> 
        <input
          type="text"
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="brouillon">Brouillon</option>
          <option value="publié">Publié</option>
        </select>

        <select 
          value={pageDepart} 
          onChange={(e) => setPageDepart(e.target.value)}
        >
          <option value="">-- Sélectionner une page de départ --</option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              Page {page.id} - {page.contenu.substring(0, 30)}...
            </option>
          ))}
        </select>

        <button type="submit">Enregistrer les modifications</button>
      </form>

      <div className="action-buttons"> 
        <button onClick={() => navigate(`/gestion-histoire/${id}`)}>
          Gérer les pages
        </button>

        <button onClick={() => navigate(`/home`)}>
          Retour
        </button>
      </div> 
    </div>
  );
}

export default ModifierHistoire;