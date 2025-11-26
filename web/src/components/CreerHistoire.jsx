import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreerHistoire() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Vous devez être connecté");
        navigate("/");
        return;
      }

      const res = await fetch("http://localhost:5000/histoire", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ titre, description }),
      });

      const data = await res.json();

      if (res.ok) navigate("/home");
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Créer une histoire</h1>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Créer</button>
      </form>
    </div>
  );
}

export default CreerHistoire;