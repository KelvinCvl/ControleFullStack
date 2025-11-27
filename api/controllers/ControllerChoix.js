const pool = require("../db");

// Créer un choix
exports.create = async (req, res) => {
  try {
    const { page_id, texte, next_page_id } = req.body;

    if (!page_id || !texte) {
      return res.status(400).json({ message: "page_id et texte requis" });
    }

    // Vérifie que la page existe
    const [pages] = await pool.query("SELECT * FROM Page WHERE id = ?", [page_id]);
    if (!pages.length) return res.status(404).json({ message: "Page non trouvée" });

    const [result] = await pool.query(
      "INSERT INTO Choix (page_id, texte, next_page_id) VALUES (?, ?, ?)",
      [page_id, texte, next_page_id || null]
    );

    res.status(201).json({ id: result.insertId, page_id, texte, next_page_id: next_page_id || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Modifier un choix
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { texte, next_page_id } = req.body;

    const [rows] = await pool.query("SELECT * FROM Choix WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Choix non trouvé" });

    await pool.query(
      "UPDATE Choix SET texte = ?, next_page_id = ? WHERE id = ?",
      [texte, next_page_id || null, id]
    );

    res.json({ message: "Choix mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un choix
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM Choix WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Choix non trouvé" });

    await pool.query("DELETE FROM Choix WHERE id = ?", [id]);
    res.json({ message: "Choix supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer tous les choix d'une page
exports.getAllForPage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const [choix] = await pool.query("SELECT * FROM Choix WHERE page_id = ?", [pageId]);
    res.json(choix);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
