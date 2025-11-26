const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.inscription = async (req, res) => {
  try {
    const { pseudo, email, motdepasse } = req.body;

    if (!pseudo || !email || !motdepasse) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    const [rows] = await pool.query(
      "SELECT id FROM Utilisateur WHERE email = ? OR pseudo = ?",
      [email, pseudo]
    );
    if (rows.length) return res.status(400).json({ message: "Utilisateur déjà existant" });

    const hash = await bcrypt.hash(motdepasse, 10);

    const [result] = await pool.query(
      "INSERT INTO Utilisateur (pseudo, email, motdepasse) VALUES (?, ?, ?)",
      [pseudo, email, hash]
    );

    res.status(201).json({ message: "Utilisateur créé", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.connexion = async (req, res) => {
  try {
    const { email, motdepasse } = req.body;

    if (!email || !motdepasse) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const [rows] = await pool.query("SELECT * FROM Utilisateur WHERE email = ?", [email]);
    if (!rows.length) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    const user = rows[0];
    const match = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!match) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, pseudo: user.pseudo, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: "Connecté", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deconnexion = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Déconnecté" });
};
