const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ServiceAuth = require("../services/ServiceAuth");

exports.inscription = async (req, res) => {
  try {
    const { pseudo, email, motdepasse } = req.body;

    if (!pseudo || !email || !motdepasse) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const [rows] = await ServiceAuth.findUserByEmailOrPseudo(email, pseudo);
    if (rows.length) return res.status(400).json({ message: "Utilisateur déjà existant" });

    const hash = await bcrypt.hash(motdepasse, 10);

    const [result] = await ServiceAuth.createUser(pseudo, email, hash);

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

    const [rows] = await ServiceAuth.findUserByEmail(email);
    if (!rows.length) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    const user = rows[0];
    const match = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!match) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, pseudo: user.pseudo, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: false,
      path: "/"
    });

    res.json({ 
      message: "Connecté", 
      token,
      user: {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deconnexion = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Déconnecté" });
};