const pool = require("../db");

module.exports = {
  getAllForHistoire: (histoireId) => {
    return pool.query(
      "SELECT * FROM Page WHERE histoire_id = ?",
      [histoireId]
    );
  },

  getById: (id) => {
    return pool.query(
      "SELECT * FROM Page WHERE id = ?",
      [id]
    );
  },

  createPage: (histoire_id, contenu, isEnd, nomFin = null) => {
    return pool.query(
      "INSERT INTO Page (histoire_id, contenu, isEnd, nomFin) VALUES (?, ?, ?, ?)",
      [histoire_id, contenu, isEnd ? 1 : 0, nomFin]
    );
  },

  updatePage: (id, contenu, isEnd, nomFin = null) => {
    return pool.query(
      "UPDATE Page SET contenu = ?, isEnd = ?, nomFin = ? WHERE id = ?",
      [contenu, isEnd ? 1 : 0, nomFin, id]
    );
  },


  deletePage: (id) => {
    return pool.query(
      "DELETE FROM Page WHERE id = ?",
      [id]
    );
  },

getOnePublic: (pageId) => {
  return pool.query(
    `SELECT 
       p.id AS page_id,
       p.contenu AS texte,
       p.isEnd,
       c.id AS choix_id,
       c.texte AS choix_texte,
       c.next_page_id
     FROM Page p
     LEFT JOIN Choix c ON p.id = c.page_id
     JOIN Histoire h ON p.histoire_id = h.id
     WHERE p.id = ? AND h.statut = 'publié'`,
    [pageId]
  );
},

getChoixPublic: (pageId) => {
  return pool.query(
    `SELECT c.id, c.texte, c.next_page_id
     FROM Choix c
     JOIN Page p ON c.page_id = p.id
     JOIN Histoire h ON p.histoire_id = h.id
     WHERE c.page_id = ? AND h.statut = 'publié'
     ORDER BY c.id`,
    [pageId]
  );
},
};
