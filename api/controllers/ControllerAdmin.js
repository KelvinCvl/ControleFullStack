const ServiceAdmin = require("../services/ServiceAdmin");

function checkAdmin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Accès interdit" });
    return false;
  }
  return true;
}

exports.getAllHistoires = async (req, res) => {
  if (!checkAdmin(req, res)) return;

  try {
    const histoires = await ServiceAdmin.getAllHistoires();
    res.json(histoires);
  } catch (err) {
    console.error("❌ Erreur getAllHistoires:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.suspendreHistoire = async (req, res) => {
  if (!checkAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const { suspendre } = req.body;

    if (typeof suspendre !== "boolean") {
      return res.status(400).json({ message: "Paramètre invalide" });
    }

    await ServiceAdmin.suspendreHistoire(id, suspendre);
    res.json({ message: `Histoire ${suspendre ? "suspendue" : "réactivée"}` });
  } catch (err) {
    console.error("❌ Erreur suspendreHistoire:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getAllUtilisateurs = async (req, res) => {
  if (!checkAdmin(req, res)) return;

  try {
    const utilisateurs = await ServiceAdmin.getAllUtilisateurs();
    res.json(utilisateurs);
  } catch (err) {
    console.error("❌ Erreur getAllUtilisateurs:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.bannirUtilisateur = async (req, res) => {
  if (!checkAdmin(req, res)) return;

  try {
    const { id } = req.params;
    await ServiceAdmin.bannirUtilisateur(id);
    res.json({ message: "Utilisateur banni" });
  } catch (err) {
    console.error("❌ Erreur bannirUtilisateur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getStatistiquesHistoire = async (req, res) => {
  if (!checkAdmin(req, res)) return;

  try {
    const { histoireId } = req.params;
    const stats = await ServiceAdmin.getStatistiquesHistoire(histoireId);
    res.json(stats);
  } catch (err) {
    console.error("❌ Erreur getStatistiquesHistoire:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
