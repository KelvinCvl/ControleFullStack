const signalementService = require('../services/ServiceSignaler');

const signalerHistoire = async (req, res) => {
  console.log('📥 Requête reçue:', req.body);
  
  try {
    const { histoire_id, utilisateur_id, raison } = req.body;

    if (!histoire_id || !raison) {
      console.log('❌ Validation échouée');
      return res.status(400).json({ message: "Histoire et raison requises" });
    }

    console.log('✅ Validation OK, appel du service...');
    
    const signalementId = await signalementService.creerSignalement({
      histoire_id,
      utilisateur_id: utilisateur_id || null,
      raison,
    });

    console.log('✅ Signalement créé avec ID:', signalementId);
    
    return res.status(201).json({ 
      message: "Signalement créé", 
      id: signalementId 
    });
    
  } catch (err) {
    console.error("❌ Erreur dans le contrôleur:", err);
    return res.status(500).json({ 
      message: "Erreur serveur",
      error: err.message 
    });
  }
};

module.exports = { signalerHistoire };