const express = require("express");
const authController = require("../controllers/ControllerAuth");

const router = express.Router();

router.post("/inscription", authController.inscription);
router.post("/connexion", authController.connexion);
router.post("/deconnexion", authController.deconnexion);

module.exports = router;
