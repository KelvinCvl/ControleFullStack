const pool = require("../db");

exports.create = async (req, res) => {
  try {
    const { histoire_id, contenu, isEnd } = req.body;

    if (!histoire_id || !contenu) {
      return res.status(400).json({ message: "histoire_id et contenu requis" });
    }

    const [result] = await pool.query(
      "INSERT INTO Page (histoire_id, contenu, isEnd) VALUES (?, ?, ?)",
      [histoire_id, contenu, isEnd ? 1 : 0]
    );

    res.status(201).json({ message: "Page créée", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getAllForHistoire = async (req, res) => {
  try {
    const { histoireId } = req.params;

    const [pages] = await pool.query(
      "SELECT * FROM Page WHERE histoire_id = ?",
      [histoireId]
    );

    res.json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenu, isEnd } = req.body;

    const [rows] = await pool.query("SELECT * FROM Page WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Page non trouvée" });

    await pool.query(
      "UPDATE Page SET contenu = ?, isEnd = ? WHERE id = ?",
      [contenu, isEnd ? 1 : 0, id]
    );

    res.json({ message: "Page mise à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM Page WHERE id = ?", [id]);
    res.json({ message: "Page supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
