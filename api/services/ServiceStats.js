const pool = require("../db");

//oui j'ai galéré ici
module.exports = {
  create: async (utilisateur_id, histoire_id, pagefinale_id) => {
    try {
      console.log("🔧 ServiceStats.create appelé avec :");
      console.log("  - utilisateur_id:", utilisateur_id);
      console.log("  - histoire_id:", histoire_id);
      console.log("  - pagefinale_id:", pagefinale_id);

      const [result] = await pool.query(
        `INSERT INTO statistique (utilisateur_id, histoire_id, pagefinale_id, datecreation)
         VALUES (?, ?, ?, NOW())`,
        [utilisateur_id, histoire_id, pagefinale_id]
      );
      
      console.log("✅ Insert réussi:", result);
      return result;
    } catch (err) {
      console.error("❌ Erreur SQL complète:", err);
      console.error("❌ Code erreur:", err.code);
      console.error("❌ Message SQL:", err.sqlMessage);
      throw err;
    }
  },

    getFinParHistoire: async (histoireId) => {
    try {
      const [rows] = await pool.query(
        `SELECT h.id AS histoire_id, h.titre, COUNT(s.id) AS count
         FROM histoire h
         LEFT JOIN statistique s ON h.id = s.histoire_id
         WHERE h.id = ?
         GROUP BY h.id, h.titre`,
        [histoireId]
      );
      return rows[0] || { histoire_id: histoireId, titre: "Inconnu", count: 0 };
    } catch (err) {
      console.error("Erreur SQL ServiceStats.getFinParHistoire :", err);
      throw err;
    }
  },
};