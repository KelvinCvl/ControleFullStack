const pool = require("../db");

module.exports = {
  findPageById: (page_id) => {
    return pool.query("SELECT * FROM Page WHERE id = ?", [page_id]);
  },

  createChoix: (page_id, texte, next_page_id) => {
    return pool.query(
      "INSERT INTO Choix (page_id, texte, next_page_id) VALUES (?, ?, ?)",
      [page_id, texte, next_page_id]
    );
  },

  findChoixById: (id) => {
    return pool.query("SELECT * FROM Choix WHERE id = ?", [id]);
  },

  updateChoix: (id, texte, next_page_id) => {
    return pool.query(
      "UPDATE Choix SET texte = ?, next_page_id = ? WHERE id = ?",
      [texte, next_page_id, id]
    );
  },

  deleteChoix: (id) => {
    return pool.query("DELETE FROM Choix WHERE id = ?", [id]);
  },

  getChoixForPage: (pageId) => {
    return pool.query("SELECT * FROM Choix WHERE page_id = ?", [pageId]);
  }
};
