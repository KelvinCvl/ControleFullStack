const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/ControllerAdmin");
const verifyToken = require("../middleware");

router.get("/histoire/all", verifyToken, adminCtrl.getAllHistoires);
router.put("/histoire/:id/suspendre", verifyToken, adminCtrl.suspendreHistoire);
router.get("/utilisateur/all", verifyToken, adminCtrl.getAllUtilisateurs);
router.put("/utilisateur/:id/bannir", verifyToken, adminCtrl.bannirUtilisateur);
router.get("/statistiques/:histoireId", verifyToken, adminCtrl.getStatistiquesHistoire);

module.exports = router;