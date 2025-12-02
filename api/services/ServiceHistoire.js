const pool = require("../db");

module.exports = {

  // ➜ CREATE : utilise les données envoyées par le controller
  create: async (data) => {
    const sql = `
      INSERT INTO Histoire 
      (titre, description, statut, pagedepart_id, auteur_id, theme)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.titre,
      data.description,
      data.statut,
      data.pagedepart_id,
      data.auteur_id,
      data.theme
    ];

    const [result] = await pool.query(sql, values);
    return result;
  },

  // ➜ Mes histoires
  getMine: (userId) => {
    return pool.query("SELECT * FROM Histoire WHERE auteur_id = ?", [userId]);
  },

  // ➜ Une histoire par son ID
  getById: (id) => {
    return pool.query("SELECT * FROM Histoire WHERE id = ?", [id]);
  },

  // ➜ Histoires publiques
  getAllPubliques: () => {
    return pool.query(`
      SELECT 
        h.id, 
        h.titre, 
        h.description, 
        h.theme,
        u.pseudo AS auteur
      FROM Histoire h
      LEFT JOIN Utilisateur u ON h.auteur_id = u.id
      WHERE h.statut = 'publié'
      ORDER BY h.id DESC
    `);
  },

  // ➜ Histoires publiées filtrées par thème
  getAllPubliquesByTheme: (theme) => {
    return pool.query(`
      SELECT 
        h.id, 
        h.titre, 
        h.description, 
        h.theme,
        u.pseudo AS auteur
      FROM Histoire h
      LEFT JOIN Utilisateur u ON h.auteur_id = u.id
      WHERE h.statut = 'publié' AND h.theme = ?
      ORDER BY h.id DESC
    `, [theme]);
  },

  // ➜ Récupérer tous les thèmes uniques
  getAllThemes: () => {
    return pool.query(`
      SELECT DISTINCT theme FROM Histoire 
      WHERE statut = 'publié' AND theme IS NOT NULL
      ORDER BY theme ASC
    `);
  },

  // ➜ UPDATE
  update: async (id, data) => {
    const sql = `
      UPDATE Histoire
      SET titre = ?, description = ?, statut = ?, pagedepart_id = ?, theme = ?
      WHERE id = ?
    `;

    const values = [
      data.titre,
      data.description,
      data.statut,
      data.pagedepart_id || null,
      data.theme,
      id
    ];

    await pool.query(sql, values);
  },

  // ➜ DELETE
  delete: (id) => {
    return pool.query("DELETE FROM Histoire WHERE id = ?", [id]);
  },

  // ➜ Début de lecture - histoire publiée + première page
  getDebutPublic: (histoireId) => {
    return pool.query(`
      SELECT 
        h.id,
        h.titre,
        h.description,
        h.theme,
        h.pagedepart_id,
        u.pseudo AS auteur,
        p.id AS page_id,
        p.contenu,
        p.isEnd
      FROM Histoire h
      LEFT JOIN Utilisateur u ON h.auteur_id = u.id
      LEFT JOIN Page p ON p.id = h.pagedepart_id
      WHERE h.id = ? AND h.statut = 'publié'
    `, [histoireId]);
  }
};
