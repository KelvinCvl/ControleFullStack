import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css"

function Home() {
  const [histoires, setHistoires] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchHistoires = async () => {
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/histoire/mes", {
        headers: { Authorization: token },
      });

      if (!res.ok) {
        console.error("Erreur HTTP", res.status);
        setHistoires([]);
        return;
      }

      const data = await res.json();
      setHistoires(data);
    } catch (err) {
      console.error("Erreur fetch:", err);
      setHistoires([]);
    }
  };

  useEffect(() => {
    fetchHistoires();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette histoire ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/histoire/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (res.ok) {
        setHistoires(histoires.filter((h) => h.id !== id));
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleToggleStatut = async (id, currentStatut) => {
    const newStatut = currentStatut === "brouillon" ? "publié" : "brouillon";

    try {
      const res = await fetch(`http://localhost:5000/histoire/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ statut: newStatut }),
      });

      if (res.ok) {
        setHistoires(
          histoires.map((h) =>
            h.id === id ? { ...h, statut: newStatut } : h
          )
        );
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
<div className="home-container">
  <h1>Mes histoires</h1>
  <button className="create-button" onClick={() => navigate("/creer-histoire")}>
    Créer une histoire
  </button>

  {histoires.length === 0 ? (
    <p>Aucune histoire pour le moment.</p>
  ) : (
    <ul>
      {histoires.map((h) => (
        <li key={h.id}>
          <strong>{h.titre}</strong>
          <span className="status">{h.statut}</span>
          <div className="actions">
            <button onClick={() => navigate(`/modifier-histoire/${h.id}`)}>Modifier</button>
            <button onClick={() => handleDelete(h.id)}>Supprimer</button>
            <button onClick={() => handleToggleStatut(h.id, h.statut)}>
              {h.statut === "brouillon" ? "Publier" : "Mettre en brouillon"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


  );
}

export default Home;
