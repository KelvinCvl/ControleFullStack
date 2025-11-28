const pool = require("../db");

module.exports = {
  createPage: (histoire_id, contenu, isEnd) => {
    return pool.query(
      "INSERT INTO Page (histoire_id, contenu, isEnd) VALUES (?, ?, ?)",
      [histoire_id, contenu, isEnd ? 1 : 0]
    );
  },

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

  updatePage: (id, contenu, isEnd) => {
    return pool.query(
      "UPDATE Page SET contenu = ?, isEnd = ? WHERE id = ?",
      [contenu, isEnd ? 1 : 0, id]
    );
  },

  deletePage: (id) => {
    return pool.query(
      "DELETE FROM Page WHERE id = ?",
      [id]
    );
  }
};
