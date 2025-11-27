import { useState, useEffect } from "react";

function PageForm({ page = {}, onUpdate, onDelete, onAdd, histoireId, isNew = false }) {
  const [contenu, setContenu] = useState(page.contenu || "");
  const [isEnd, setIsEnd] = useState(page.isEnd || false);
  const [choix, setChoix] = useState([]);
  const [newChoixTexte, setNewChoixTexte] = useState("");
  const [newChoixNext, setNewChoixNext] = useState("");

  const token = localStorage.getItem("token");

  // Récupérer les choix existants si page existante
  useEffect(() => {
    if (!page.id) return;
    const fetchChoix = async () => {
      const res = await fetch(`http://localhost:5000/choix/page/${page.id}`, {
        headers: { Authorization: token },
      });
      if (!res.ok) return;
      const data = await res.json();
      setChoix(data);
    };
    fetchChoix();
  }, [page.id]);

  const handleSubmitPage = async () => {
    try {
      const url = isNew 
        ? "http://localhost:5000/page" 
        : `http://localhost:5000/page/${page.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ contenu, isEnd }),
      });

      const data = await res.json();
      if (res.ok) {
        if (isNew) onAdd({ ...data, contenu, isEnd });
        else onUpdate({ ...page, contenu, isEnd });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleDeletePage = async () => {
    if (!window.confirm("Supprimer cette page ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/page/${page.id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (res.ok) onDelete(page.id);
      else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChoix = async () => {
    if (!newChoixTexte) return;
    try {
      const res = await fetch("http://localhost:5000/choix", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          page_id: page.id,
          texte: newChoixTexte,
          next_page_id: newChoixNext || null,
        }),
      });
      const data = await res.json();
      if (res.ok) setChoix([...choix, data]);
      else alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <textarea 
        placeholder="Contenu de la page" 
        value={contenu} 
        onChange={(e) => setContenu(e.target.value)} 
      />
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={isEnd} 
            onChange={(e) => setIsEnd(e.target.checked)} 
          /> Fin
        </label>
      </div>
      <button onClick={handleSubmitPage}>{isNew ? "Créer page" : "Mettre à jour"}</button>
      {!isNew && <button onClick={handleDeletePage}>Supprimer page</button>}

      {!isNew && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Choix</h4>
          <ul>
            {choix.map(c => <li key={c.id}>{c.texte} → page {c.next_page_id}</li>)}
          </ul>

          <input 
            placeholder="Texte du choix" 
            value={newChoixTexte} 
            onChange={(e) => setNewChoixTexte(e.target.value)} 
          />
          <input 
            placeholder="Page suivante (ID)" 
            value={newChoixNext} 
            onChange={(e) => setNewChoixNext(e.target.value)} 
          />
          <button onClick={handleAddChoix}>Ajouter choix</button>
        </div>
      )}
    </div>
  );
}

export default PageForm;
