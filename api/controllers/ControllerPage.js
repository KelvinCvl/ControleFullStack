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

exports.getOnePublic = async (req, res) => {
  try {
    const [rows] = await ServicePage.getOnePublic(req.params.id);

    if (!rows.length) return res.status(404).json({ message: "Page non trouvée" });

    const page = {
      id: rows[0].page_id,
      texte: rows[0].texte,
      isEnd: rows[0].isEnd,
    };

    const choix = rows
      .filter(r => r.choix_id !== null)
      .map(r => ({
        id: r.choix_id,
        texte: r.choix_texte,
        next_page_id: r.next_page_id
      }));

    res.json({ page, choix });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.getChoixPublic = async (req, res) => {
  try {
    const [rows] = await ServicePage.getChoixPublic(req.params.pageId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur" });
  }
};