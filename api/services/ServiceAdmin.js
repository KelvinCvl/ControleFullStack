const pool = require("../db");

module.exports = {
  getAllHistoires: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT id, titre, description, statut, pagedepart_id, auteur_id
         FROM Histoire
         ORDER BY id DESC`
      );
      return rows;
    } catch (err) {
      console.error("Erreur SQL getAllHistoires:", err);
      throw err;
    }
  },

  suspendreHistoire: (id, suspendre) => {
    return pool.query(
      "UPDATE Histoire SET statut = ? WHERE id = ?",
      [suspendre ? "suspendu" : "publié", id]
    );
  },

  getAllUtilisateurs: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT id, pseudo, email, role, statut
         FROM Utilisateur
         ORDER BY id DESC`
      );
      return rows;
    } catch (err) {
      console.error("Erreur SQL getAllUtilisateurs:", err);
      throw err;
    }
  },

  bannirUtilisateur: (id) => {
    return pool.query(
      "UPDATE Utilisateur SET statut = 'banni' WHERE id = ?",
      [id]
    );
  },

  getStatistiquesHistoire: async (histoireId) => {
    try {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS nb_parties, MAX(datecreation) AS derniere_partie
         FROM statistique
         WHERE histoire_id = ?`,
        [histoireId]
      );
      return rows[0];
    } catch (err) {
      console.error("Erreur SQL getStatistiquesHistoire:", err);
      throw err;
    }
  }
};
