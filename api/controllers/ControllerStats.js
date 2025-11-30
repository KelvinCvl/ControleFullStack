const ServiceStatistique = require("../services/ServiceStats");

exports.create = async (req, res) => {
  try {
    console.log("Body reçu :", req.body);
    const { utilisateur_id, histoire_id, pagefinale_id } = req.body;

    if (!utilisateur_id || !histoire_id || !pagefinale_id) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const result = await ServiceStatistique.create(utilisateur_id, histoire_id, pagefinale_id);
    console.log("Résultat INSERT :", result);

    res.status(201).json({ message: "Statistique enregistrée", id: result.insertId });
  } catch (err) {
    console.error("Erreur ControllerStats.create :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getStatHistoire = async (req, res) => {
  try {
    const { histoireId } = req.params;
    const result = await ServiceStatistique.getFinParHistoire(histoireId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Erreur ControllerStats.getStatHistoire :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
