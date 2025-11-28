const ServicePage = require("../services/ServicePage");

exports.create = async (req, res) => {
  try {
    const { histoire_id, contenu, isEnd } = req.body;

    if (!histoire_id || !contenu) {
      return res.status(400).json({ message: "histoire_id et contenu requis" });
    }

    const [result] = await ServicePage.createPage(histoire_id, contenu, isEnd);

    res.status(201).json({ message: "Page créée", id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getAllForHistoire = async (req, res) => {
  try {
    const { histoireId } = req.params;
    const [pages] = await ServicePage.getAllForHistoire(histoireId);
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

    const [rows] = await ServicePage.getById(id);
    if (!rows.length) return res.status(404).json({ message: "Page non trouvée" });

    await ServicePage.updatePage(id, contenu, isEnd);

    res.json({ message: "Page mise à jour" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await ServicePage.deletePage(id);
    res.json({ message: "Page supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
