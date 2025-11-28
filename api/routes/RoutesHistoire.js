const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware");
const histoireCtrl = require("../controllers/ControllerHistoire");

router.get("/publiques", histoireCtrl.getAllPubliques);
router.get("/:id/debut", histoireCtrl.getDebutPublic);

router.post("/", verifyToken, histoireCtrl.create);
router.get("/mes", verifyToken, histoireCtrl.getMine);
router.get("/:id", verifyToken, histoireCtrl.getById);
router.put("/:id", verifyToken, histoireCtrl.update);
router.delete("/:id", verifyToken, histoireCtrl.remove);

module.exports = router;
