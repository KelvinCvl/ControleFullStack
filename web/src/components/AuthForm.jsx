import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/AuthForm.css';

function AuthForm() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [mode, setMode] = useState("inscription");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      mode === "inscription"
        ? "http://localhost:5000/auth/inscription"
        : "http://localhost:5000/auth/connexion";

    const body = mode === "inscription"
      ? { pseudo, email, motdepasse }
      : { email, motdepasse };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (mode === "connexion" && data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        if (mode === "inscription") {
          alert("Inscription réussie ! Connectez-vous.");
          setMode("connexion");
          return;
        }

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
    <div className="auth-container">
      <h1>Partage d'histoire</h1>
      <div className="mode-buttons">
        <button className={mode === "inscription" ? "active" : ""} onClick={() => setMode("inscription")}>
          Inscription
        </button>
        <button className={mode === "connexion" ? "active" : ""} onClick={() => setMode("connexion")}>
          Connexion
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {mode === "inscription" && (
          <input type="text" placeholder="Pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={motdepasse} onChange={(e) => setMotdepasse(e.target.value)} />
        <button type="submit">{mode === "inscription" ? "S'inscrire" : "Se connecter"}</button>
      </form>
    </div>
  );
}

export default AuthForm;
