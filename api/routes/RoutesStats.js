const express = require("express");
const router = express.Router();
const statCtrl = require("../controllers/ControllerStats");

router.post("/", statCtrl.create);
router.get("/:histoireId", statCtrl.getStatHistoire);

module.exports = router;
