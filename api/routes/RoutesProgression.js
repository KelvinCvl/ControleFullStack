const express = require("express");
const router = express.Router();
const progressionController = require("../controllers/ControllerProgression");

router.post("/", progressionController.saveProgression);
router.post("/reset", progressionController.resetProgression);
router.get("/:utilisateur_id/:histoire_id", progressionController.getLastPage);

module.exports = router;
