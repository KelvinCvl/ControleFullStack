import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Home.css";

function Statistiques() {
  const { id } = useParams(); 
  const [stat, setStat] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchStat();
  }, [id]);

  const fetchStat = async () => {
    try {
      const res = await fetch(`http://localhost:5000/statistiques/${id}`, {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setStat(data);
      } else {
        console.error("Erreur récupération stats", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!stat) return <p>Chargement...</p>;

  return (
    <div className="home-container">
      <h2>Statistiques de l'histoire : {stat.titre}</h2>
      <p>Nombre de fois où cette histoire à été fini : {stat.count}</p>
      <button className="create-button" onClick={() => navigate(-1)}>
        Retour
      </button>
    </div>
  );
}

export default Statistiques;
