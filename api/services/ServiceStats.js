const pool = require("../db");
const ServicePage = require("./ServicePage");

module.exports = {
  create: async (utilisateur_id, histoire_id, pagefinale_id) => {
    try {
      const [pageRows] = await ServicePage.getById(pagefinale_id);
      const typeFin = pageRows.length && pageRows[0].nomFin ? pageRows[0].nomFin : null;

      const [result] = await pool.query(
        `INSERT INTO statistique 
         (utilisateur_id, histoire_id, pagefinale_id, typeFin, datecreation)
         VALUES (?, ?, ?, ?, NOW())`,
        [utilisateur_id, histoire_id, pagefinale_id, typeFin]
      );

      return result;
    } catch (err) {
      console.error("Erreur ServiceStats.create :", err);
      throw err;
    }
  },

  getFinParUtilisateur: async (utilisateurId) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
           h.id AS histoire_id,
           h.titre,
           s.typeFin,
           s.datecreation
         FROM statistique s
         INNER JOIN histoire h ON s.histoire_id = h.id
         WHERE s.utilisateur_id = ?
           AND s.typeFin IS NOT NULL
         ORDER BY s.datecreation DESC`,
        [utilisateurId]
      );

      const stats = {};

      rows.forEach((row) => {
        const histoireId = String(row.histoire_id); 

        if (!stats[histoireId]) {
          stats[histoireId] = {
            titre: row.titre,
            finsAtteintes: [],
          };
        }

        stats[histoireId].finsAtteintes.push({
          typeFin: row.typeFin,
          date: row.datecreation,
        });
      });

      return stats;
    } catch (err) {
      console.error("Erreur ServiceStats.getFinParUtilisateur :", err);
      throw err;
    }
  },

  getFinParHistoire: async (histoireId) => {
    try {
      const [rows] = await pool.query(
        `SELECT typeFin, COUNT(*) as nombre
         FROM statistique
         WHERE histoire_id = ? AND typeFin IS NOT NULL
         GROUP BY typeFin`,
        [histoireId]
      );
      return rows;
    } catch (err) {
      console.error("Erreur ServiceStats.getFinParHistoire :", err);
      throw err;
    }
  },
};