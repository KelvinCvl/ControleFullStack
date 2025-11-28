const pool = require("../db");

module.exports = {
  createHistoire: (titre, description, userId) => {
    return pool.query(
      "INSERT INTO Histoire (titre, description, statut, pagedepart_id, auteur_id) VALUES (?, ?, 'brouillon', NULL, ?)",
      [titre, description, userId]
    );
  },

  getMine: (userId) => {
    return pool.query("SELECT * FROM Histoire WHERE auteur_id = ?", [userId]);
  },

  getById: (histoireId, userId) => {
    return pool.query(
      "SELECT * FROM Histoire WHERE id = ? AND auteur_id = ?",
      [histoireId, userId]
    );
  },

  getAuteur: (histoireId) => {
    return pool.query(
      "SELECT auteur_id FROM Histoire WHERE id = ?",
      [histoireId]
    );
  },

  updateHistoire: (histoireId, titre, description, statut, pagedepart_id) => {
    return pool.query(
      `UPDATE Histoire 
       SET titre = ?, description = ?, statut = ?, pagedepart_id = ?
       WHERE id = ?`,
      [titre, description, statut, pagedepart_id || null, histoireId]
    );
  },

  deleteHistoire: (histoireId) => {
    return pool.query("DELETE FROM Histoire WHERE id = ?", [histoireId]);
  }
};
