const avisService = require("../services/ServiceAvis");

async function getAvis(req, res) {
  const { histoire_id } = req.params;
  console.log("📥 GET /avis/histoire/" + histoire_id);
  
  try {
    const data = await avisService.getAvis(histoire_id);
    console.log("✅ Données avis:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Erreur getAvis:", err.message);
    console.error(err.stack);
    res.status(500).json({ 
      error: err.message,
      moyenne: 0, 
      total: 0 
    });
  }
}

async function postAvis(req, res) {
  const { utilisateur_id, histoire_id, note } = req.body;
  console.log("📥 POST /avis", { utilisateur_id, histoire_id, note });
  
  try {
    const data = await avisService.ajouterAvis(utilisateur_id, histoire_id, note);
    console.log("✅ Avis ajouté:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Erreur postAvis:", err.message);
    console.error(err.stack);
    res.status(500).json({ 
      error: err.message,
      moyenne: 0, 
      total: 0 
    });
  }
}

module.exports = { getAvis, postAvis };