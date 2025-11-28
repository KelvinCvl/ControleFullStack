const ServiceHistoire = require("../services/ServiceHistoire");

exports.create = async (req, res) => {
  try {
    const { titre, description } = req.body;
    const userId = req.user.id;

    if (!titre || !description) {
      return res.status(400).json({ message: "Titre et description requis" });
    }

    const [result] = await ServiceHistoire.createHistoire(titre, description, userId);

    res.status(201).json({ message: "Histoire créée", id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await ServiceHistoire.getMine(userId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getById = async (req, res) => {
  try {
    const histoireId = req.params.id;
    const userId = req.user.id;

    const [rows] = await ServiceHistoire.getById(histoireId, userId);
    if (!rows.length) return res.status(404).json({ message: "Histoire non trouvée" });

    res.json(rows[0]);

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

    const [rows] = await ServiceHistoire.getAuteur(histoireId);
    if (!rows.length || rows[0].auteur_id !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await ServiceHistoire.updateHistoire(histoireId, titre, description, statut, pagedepart_id);

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

    const [rows] = await ServiceHistoire.getAuteur(histoireId);
    if (!rows.length || rows[0].auteur_id !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await ServiceHistoire.deleteHistoire(histoireId);

    res.json({ message: "Histoire supprimée" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
