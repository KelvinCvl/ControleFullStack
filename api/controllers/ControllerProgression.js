const progressionService = require("../services/ServiceProgression");

async function saveProgression(req, res) {
  const { utilisateur_id, histoire_id, page_id } = req.body;
  try {
    await progressionService.saveProgression(utilisateur_id, histoire_id, page_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
}

async function resetProgression(req, res) {
  const { utilisateur_id, histoire_id } = req.body;
  try {
    await progressionService.resetProgression(utilisateur_id, histoire_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
}

async function getLastPage(req, res) {
  const { utilisateur_id, histoire_id } = req.params;
  try {
    const lastPageId = await progressionService.getLastPage(utilisateur_id, histoire_id);
    res.json({ lastPageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ lastPageId: null });
  }
}

module.exports = {
  saveProgression,
  resetProgression,
  getLastPage,
};
