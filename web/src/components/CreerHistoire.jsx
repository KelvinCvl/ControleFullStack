import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreerHistoire.css"; // Ajoute cette ligne

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
    <div className="creer-container"> {/* Remplace style par className */}
      <h1>Créer une histoire</h1>

      <form className="creer-form" onSubmit={handleSubmit}> {/* Ajoute className */}
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
      <button className="back-button" onClick={() => navigate(`/home`)}>Retour</button>
    </div>
  );
}

export default CreerHistoire;