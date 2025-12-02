const express = require("express");
const router = express.Router();
const statCtrl = require("../controllers/ControllerStats");

router.post("/", statCtrl.create);
router.get("/utilisateur/:id", statCtrl.getUtilisateurStats);
router.get("/simples/:histoireId", statCtrl.getStatistiquesSimples);
router.get("/parcours/:histoireId/:pageFinaleId", statCtrl.getStatistiquesParcours);
router.get("/:histoireId", statCtrl.getStatHistoire);

module.exports = router;