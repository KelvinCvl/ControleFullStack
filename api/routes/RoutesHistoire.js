const express = require("express");
const router = express.Router();
const ControllerHistoire = require("../controllers/ControllerHistoire");
const verifyToken = require("../middleware");

// 📌 Récupérer mes histoires
router.get("/mine", verifyToken, ControllerHistoire.getMine);

// 📌 Récupérer tous les thèmes
router.get("/themes", ControllerHistoire.getAllThemes);

// 📌 Récupérer histoires par thème
router.get("/theme/:theme", ControllerHistoire.getByTheme);

// 📌 Récupérer toutes les histoires publiées
router.get("/publiques", ControllerHistoire.getAllPubliques);

// 📌 Créer une histoire
router.post("/", verifyToken, ControllerHistoire.create);

// 📌 Début de lecture (public) - DOIT être AVANT /:id
router.get("/:id/debut", ControllerHistoire.getDebutPublic);

// 📌 Récupérer une histoire par id
router.get("/:id", ControllerHistoire.getById);

// 📌 Modifier une histoire
router.put("/:id", verifyToken, ControllerHistoire.update);

// 📌 Supprimer une histoire
router.delete("/:id", verifyToken, ControllerHistoire.delete);

module.exports = router;
