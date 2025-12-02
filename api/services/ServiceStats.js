const pool = require("../db");
const ServicePage = require("./ServicePage");

module.exports = {
  // ➤ Créer une statistique
  create: async (utilisateur_id, histoire_id, pagefinale_id) => {
    try {
      // Récupère la page finale pour identifier la fin
      const [pageRows] = await ServicePage.getById(pagefinale_id);
      const nomFin = pageRows.length ? pageRows[0].nomFin : null;

      const [result] = await pool.query(
        `INSERT INTO statistique 
         (utilisateur_id, histoire_id, pagefinale_id, datecreation)
         VALUES (?, ?, ?, NOW())`,
        [utilisateur_id, histoire_id, pagefinale_id]
      );

      return { ...result, nomFin };
    } catch (err) {
      console.error("Erreur ServiceStats.create :", err);
      throw err;
    }
  },

  // ➤ Récupérer les fins atteintes par utilisateur
  getFinParUtilisateur: async (utilisateurId) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
           h.id AS histoire_id,
           h.titre,
           s.pagefinale_id,
           s.datecreation
         FROM statistique s
         INNER JOIN histoire h ON s.histoire_id = h.id
         WHERE s.utilisateur_id = ?
         ORDER BY s.datecreation DESC`,
        [utilisateurId]
      );

      const stats = {};

      for (const row of rows) {
        const histoireId = String(row.histoire_id);

        // Récupérer la page finale pour connaître le type de fin
        const [pageRows] = await ServicePage.getById(row.pagefinale_id);
        const nomFin = pageRows.length ? pageRows[0].nomFin : "Fin inconnue";

        if (!stats[histoireId]) {
          stats[histoireId] = {
            titre: row.titre,
            finsAtteintes: []
          };
        }

        stats[histoireId].finsAtteintes.push({
          typeFin: nomFin,
          date: row.datecreation
        });
      }

      return stats;
    } catch (err) {
      console.error("Erreur ServiceStats.getFinParUtilisateur :", err);
      throw err;
    }
  },

  // ➤ Statistiques des fins pour une histoire
  getFinParHistoire: async (histoireId) => {
    try {
      const [rows] = await pool.query(
        `SELECT pagefinale_id
         FROM statistique
         WHERE histoire_id = ?`,
        [histoireId]
      );

      const stats = {};

      for (const row of rows) {
        const [pageRows] = await ServicePage.getById(row.pagefinale_id);
        const nomFin = pageRows.length ? pageRows[0].nomFin : "Fin inconnue";

        stats[nomFin] = (stats[nomFin] || 0) + 1;
      }

      return stats;
    } catch (err) {
      console.error("Erreur ServiceStats.getFinParHistoire :", err);
      throw err;
    }
  },

  // ➤ NOUVELLES STATS : Nombre de fois qu'une fin a été atteinte + total parties
  getStatistiquesSimples: async (histoireId) => {
    try {
      // Total parties jouées
      const [totalRows] = await pool.query(
        `SELECT COUNT(*) as totalParties FROM statistique WHERE histoire_id = ?`,
        [histoireId]
      );

      const totalParties = totalRows[0].totalParties;

      // Répartition des fins
      const [finsRows] = await pool.query(
        `SELECT pagefinale_id, COUNT(*) as count
         FROM statistique
         WHERE histoire_id = ?
         GROUP BY pagefinale_id`,
        [histoireId]
      );

      const finsAtteintes = {};
      for (const row of finsRows) {
        const [pageRows] = await ServicePage.getById(row.pagefinale_id);
        const nomFin = pageRows.length ? pageRows[0].nomFin || `Fin #${row.pagefinale_id}` : `Fin #${row.pagefinale_id}`;
        finsAtteintes[nomFin] = row.count;
      }

      return {
        totalParties,
        finsAtteintes
      };
    } catch (err) {
      console.error("Erreur ServiceStats.getStatistiquesSimples :", err);
      throw err;
    }
  },

  // ➤ NOUVELLES STATS : Pourcentage joueurs même chemin + répartition %
  getStatistiquesParcours: async (histoireId, pageFinaleId) => {
    try {
      // Total parties
      const [totalRows] = await pool.query(
        `SELECT COUNT(*) as total FROM statistique WHERE histoire_id = ?`,
        [histoireId]
      );

      const totalParties = totalRows[0].total || 1;

      // Parties ayant atteint cette fin
      const [finRows] = await pool.query(
        `SELECT COUNT(*) as count FROM statistique 
         WHERE histoire_id = ? AND pagefinale_id = ?`,
        [histoireId, pageFinaleId]
      );

      const partiesAvecCetteFin = finRows[0].count || 0;
      const pourcentageJoueurs = Math.round((partiesAvecCetteFin / totalParties) * 100);

      // Répartition % par fin
      const [allFinsRows] = await pool.query(
        `SELECT pagefinale_id, COUNT(*) as count
         FROM statistique
         WHERE histoire_id = ?
         GROUP BY pagefinale_id`,
        [histoireId]
      );

      const repartitionFins = {};
      for (const row of allFinsRows) {
        const [pageRows] = await ServicePage.getById(row.pagefinale_id);
        const nomFin = pageRows.length ? pageRows[0].nomFin || `Fin #${row.pagefinale_id}` : `Fin #${row.pagefinale_id}`;
        const pourcentage = Math.round((row.count / totalParties) * 100);
        repartitionFins[nomFin] = {
          count: row.count,
          percentage: pourcentage
        };
      }

      return {
        pourcentageJoueurs,
        repartitionFins,
        totalParties
      };
    } catch (err) {
      console.error("Erreur ServiceStats.getStatistiquesParcours :", err);
      throw err;
    }
  }
};
