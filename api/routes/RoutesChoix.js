const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware");
const choixCtrl = require("../controllers/ControllerChoix");

// CRUD choix
router.post("/", verifyToken, choixCtrl.create);
router.put("/:id", verifyToken, choixCtrl.update);
router.delete("/:id", verifyToken, choixCtrl.remove);
router.get("/page/:pageId", verifyToken, choixCtrl.getAllForPage);

module.exports = router;
