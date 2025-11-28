const ServiceChoix = require("../services/ServiceChoix");

exports.create = async (req, res) => {
  try {
    const { page_id, texte, next_page_id } = req.body;

    if (!page_id || !texte) {
      return res.status(400).json({ message: "page_id et texte requis" });
    }

    const [pages] = await ServiceChoix.findPageById(page_id);
    if (!pages.length) return res.status(404).json({ message: "Page non trouvée" });

    const [result] = await ServiceChoix.createChoix(
      page_id,
      texte,
      next_page_id || null
    );

    res.status(201).json({
      id: result.insertId,
      page_id,
      texte,
      next_page_id: next_page_id || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { texte, next_page_id } = req.body;

    const [rows] = await ServiceChoix.findChoixById(id);
    if (!rows.length) return res.status(404).json({ message: "Choix non trouvé" });

    await ServiceChoix.updateChoix(id, texte, next_page_id || null);

    res.json({ message: "Choix mis à jour" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await ServiceChoix.findChoixById(id);
    if (!rows.length) return res.status(404).json({ message: "Choix non trouvé" });

    await ServiceChoix.deleteChoix(id);

    res.json({ message: "Choix supprimé" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getAllForPage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const [choix] = await ServiceChoix.getChoixForPage(pageId);

    res.json(choix);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
