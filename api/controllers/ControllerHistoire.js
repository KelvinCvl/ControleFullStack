const pool = require("../db");

exports.create = async (req, res) => {
  try {
    const { titre, description } = req.body;
    const userId = req.user.id;

    if (!titre || !description) {
      return res.status(400).json({ message: "Titre et description requis" });
    }

    const [result] = await pool.query(
      "INSERT INTO Histoire (titre, description, statut, pagedepart_id, auteur_id) VALUES (?, ?, 'brouillon', NULL, ?)",
      [titre, description, userId]
    );

    res.status(201).json({
      message: "Histoire créée",
      id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getMine = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT * FROM Histoire WHERE auteur_id = ?",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.update = async (req, res) => {
  try {
    const histoireId = req.params.id;
    const userId = req.user.id;
    const { titre, description, statut, pagedepart_id } = req.body;

    const [rows] = await pool.query(
      "SELECT auteur_id FROM Histoire WHERE id = ?",
      [histoireId]
    );

    if (!rows.length || rows[0].auteur_id !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await pool.query(
      `UPDATE Histoire 
       SET titre = ?, description = ?, statut = ?, pagedepart_id = ?
       WHERE id = ?`,
      [titre, description, statut, pagedepart_id || null, histoireId]
    );

    res.json({ message: "Histoire mise à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.remove = async (req, res) => {
  try {
    const histoireId = req.params.id;
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT auteur_id FROM Histoire WHERE id = ?",
      [histoireId]
    );

    if (!rows.length || rows[0].auteur_id !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await pool.query("DELETE FROM Histoire WHERE id = ?", [histoireId]);

    res.json({ message: "Histoire supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
