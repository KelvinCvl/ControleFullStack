// controllers/ControllerStats.js
const ServiceStats = require("../services/ServiceStats");

exports.create = async (req, res) => {
  try {
    const { utilisateur_id, histoire_id, pagefinale_id } = req.body;

    if (!utilisateur_id || !histoire_id || !pagefinale_id) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    await ServiceStats.create(utilisateur_id, histoire_id, pagefinale_id);
    res.status(201).json({ message: "Fin enregistrée avec succès" });
  } catch (err) {
    console.error("Erreur création statistique :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getUtilisateurStats = async (req, res) => {
  try {
    const { id } = req.params; 
    const stats = await ServiceStats.getFinParUtilisateur(id);
    res.json(stats);
  } catch (err) {
    console.error("Erreur récupération stats utilisateur :", err);
    res.status(500).json({ message: "Impossible de charger les statistiques" });
  }
};

exports.getStatHistoire = async (req, res) => {
  try {
    const { histoireId } = req.params;
    const stats = await ServiceStats.getFinParHistoire(histoireId);
    res.json(stats);
  } catch (err) {
    console.error("Erreur stats histoire :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};