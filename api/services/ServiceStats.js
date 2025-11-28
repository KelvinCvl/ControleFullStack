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
};