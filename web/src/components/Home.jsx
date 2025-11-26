import { useEffect, useState } from "react";

function Home() {
  const [histoires, setHistoires] = useState([]);

  useEffect(() => {
  const fetchHistoires = async () => {
    try {
      const res = await fetch("http://localhost:5000/histoire/mes", {
        credentials: "include",
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

  fetchHistoires();
}, []);


  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mes histoires</h1>

      <a href="/creer-histoire">
        <button>Créer une histoire</button>
      </a>

      <ul>
        {histoires.map((h) => (
          <li key={h.id}>
            <strong>{h.titre}</strong> — {h.statut}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
