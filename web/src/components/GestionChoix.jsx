import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function GestionChoix() {
  const { pageId } = useParams(); // id de la page actuelle
  const token = localStorage.getItem("token");

  const [choix, setChoix] = useState([]);
  const [texte, setTexte] = useState("");
  const [nextPageId, setNextPageId] = useState("");

  // Récupérer tous les choix de la page
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

  // Créer un nouveau choix
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

  // Supprimer un choix
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
    <div style={{ padding: "2rem" }}>
      <h1>Gestion des choix</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Texte du choix"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID de la page suivante (facultatif)"
          value={nextPageId}
          onChange={(e) => setNextPageId(e.target.value)}
        />
        <button type="submit">Ajouter le choix</button>
      </form>

      <h2>Choix existants</h2>
      {choix.length === 0 ? (
        <p>Aucun choix pour cette page</p>
      ) : (
        <ul>
          {choix.map((c) => (
            <li key={c.id} style={{ marginBottom: "1rem" }}>
              {c.texte} — vers page {c.next_page_id || "fin"}{" "}
              <button onClick={() => handleDelete(c.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GestionChoix;