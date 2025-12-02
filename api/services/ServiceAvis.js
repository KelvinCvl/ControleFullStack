const pool = require("../db");

async function getAvis(histoire_id) {
  console.log("🔍 getAvis pour histoire_id:", histoire_id);
  
  try {
    const id = parseInt(histoire_id);
    
    if (isNaN(id)) {
      throw new Error(`histoire_id invalide: ${histoire_id}`);
    }

    const [rows] = await pool.query(
      "SELECT AVG(note) AS moyenne, COUNT(*) AS total FROM avis WHERE histoire_id = ?",
      [id]
    );
    
    console.log("📊 Résultat MySQL:", rows);
    
    if (!rows || rows.length === 0) {
      console.log("⚠️ Aucun résultat");
      return { moyenne: 0, total: 0 };
    }
    
    const row = rows[0];
    console.log("📊 Row:", row);

    const moyenne = row.moyenne !== null ? parseFloat(row.moyenne) : 0;
    const total = row.total !== null ? parseInt(row.total, 10) : 0;
    
    console.log("✅ Résultat final:", { moyenne, total });
    
    return { moyenne, total };
    
  } catch (err) {
    console.error("❌ Erreur dans getAvis:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    throw err;
  }
}

async function ajouterAvis(utilisateur_id, histoire_id, note) {
  console.log("➕ ajouterAvis:", { utilisateur_id, histoire_id, note });
  
  try {
    const uid = parseInt(utilisateur_id);
    const hid = parseInt(histoire_id);
    const n = parseInt(note);
    
    if (isNaN(uid) || isNaN(hid) || isNaN(n)) {
      throw new Error("Paramètres invalides");
    }
    
    if (n < 1 || n > 5) {
      throw new Error("La note doit être entre 1 et 5");
    }

    const [existing] = await pool.query(
      "SELECT * FROM avis WHERE utilisateur_id = ? AND histoire_id = ?",
      [uid, hid]
    );

    if (existing.length > 0) {
      console.log("🔄 Mise à jour avis existant");
      await pool.query(
        "UPDATE avis SET note = ? WHERE utilisateur_id = ? AND histoire_id = ?",
        [n, uid, hid]
      );
    } else {
      console.log("✨ Création nouvel avis");
      await pool.query(
        "INSERT INTO avis (utilisateur_id, histoire_id, note) VALUES (?, ?, ?)",
        [uid, hid, n]
      );
    }

    return getAvis(hid);
    
  } catch (err) {
    console.error("❌ Erreur dans ajouterAvis:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    throw err;
  }
}

module.exports = {
  getAvis,
  ajouterAvis,
};