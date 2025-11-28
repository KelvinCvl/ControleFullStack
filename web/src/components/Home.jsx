import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

function Home() {
  const [mesHistoires, setMesHistoires] = useState([]);
  const [toutesHistoires, setToutesHistoires] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchMesHistoires();
    }
  }, []);

  const fetchMesHistoires = async () => {
    try {
      const res = await fetch("http://localhost:5000/histoire/mes", {
        headers: { Authorization: token },
      });
      if (res.ok) setMesHistoires(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const [histRes, userRes] = await Promise.all([
        fetch("http://localhost:5000/admin/histoire/all", { 
          headers: { Authorization: token } 
        }),
        fetch("http://localhost:5000/admin/utilisateur/all", { 
          headers: { Authorization: token } 
        }),
      ]);

      if (histRes.ok) {
        const data = await histRes.json();
        setToutesHistoires(data);
      } else {
        console.error("❌ Erreur histoires:", histRes.status);
      }

      if (userRes.ok) {
        const data = await userRes.json();
        setUtilisateurs(data);
      } else {
        console.error("❌ Erreur utilisateurs:", userRes.status);
      }
    } catch (err) {
      console.error("❌ Erreur fetch admin:", err);
    }
  };

  const handleSuspendreHistoire = async (id, statut) => {
    const suspendre = statut !== "suspendu";
    try {
      const res = await fetch(`http://localhost:5000/admin/histoire/${id}/suspendre`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ suspendre }),
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBannirUtilisateur = async (utilisateurId) => {
    if (!window.confirm("Voulez-vous vraiment bannir cet utilisateur ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/utilisateur/${utilisateurId}/bannir`, {
        method: "PUT",
        headers: { Authorization: token },
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoirStats = (id) => navigate(`/statistiques/${id}`);

  const handleDeconnexion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="home-container">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <button className="create-button" onClick={() => navigate("/toutes-histoires")}>
          Voir toutes les histoires publiées
        </button>
        <button className="create-button" style={{ background: "#e74c3c" }} onClick={handleDeconnexion}>
          Déconnexion
        </button>
      </div>

      {!isAdmin && (
        <>
          <h2>Mes histoires</h2>
          <button className="create-button" onClick={() => navigate("/creer-histoire")}>
            Créer une histoire
          </button>
          {mesHistoires.length === 0 ? (
            <p>Aucune histoire pour le moment.</p>
          ) : (
            <ul className="scrollable-list">
              {mesHistoires.map(h => (
                <li key={h.id}>
                  <strong>{h.titre}</strong> <span className="status">{h.statut}</span>
                  <div className="actions">
                    <button onClick={() => navigate(`/modifier-histoire/${h.id}`)}>Modifier</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {isAdmin && (
        <>
          <h2>Administration</h2>

          <h3>Histoires ({toutesHistoires.length})</h3>
          {toutesHistoires.length === 0 ? (
            <p>Aucune histoire.</p>
          ) : (
            <ul className="scrollable-list">
              {toutesHistoires.map(h => (
                <li key={h.id}>
                  <strong>{h.titre}</strong> <span className="status">{h.statut}</span>
                  <div className="actions">
                    <button onClick={() => handleSuspendreHistoire(h.id, h.statut)}>
                      {h.statut === "suspendu" ? "Réactiver" : "Suspendre"}
                    </button>
                    <button onClick={() => handleVoirStats(h.id)}>Voir stats</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h3>Utilisateurs ({utilisateurs.length})</h3>
          {utilisateurs.length === 0 ? (
            <p>Aucun utilisateur.</p>
          ) : (
            <ul className="scrollable-list">
              {utilisateurs.map(u => (
                <li key={u.id}>
                  {u.pseudo} ({u.email}) - {u.role} - {u.statut}
                  {u.role !== "admin" && u.statut !== "banni" && (
                    <button onClick={() => handleBannirUtilisateur(u.id)}>Bannir</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
