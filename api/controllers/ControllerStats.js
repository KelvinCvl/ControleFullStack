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

// ➕ NOUVELLES ROUTES

// GET /stats/simples/:histoireId - Stats simples (nombre fins + total parties)
exports.getStatistiquesSimples = async (req, res) => {
  try {
    const { histoireId } = req.params;
    const stats = await ServiceStats.getStatistiquesSimples(histoireId);
    res.json(stats);
  } catch (err) {
    console.error("Erreur stats simples :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /stats/parcours/:histoireId/:pageFinaleId - Stats parcours
exports.getStatistiquesParcours = async (req, res) => {
  try {
    const { histoireId, pageFinaleId } = req.params;
    const stats = await ServiceStats.getStatistiquesParcours(histoireId, pageFinaleId);
    res.json(stats);
  } catch (err) {
    console.error("Erreur stats parcours :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};