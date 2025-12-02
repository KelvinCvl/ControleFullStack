const express = require("express");
const router = express.Router();
const avisController = require("../controllers/ControllerAvis");

router.get("/histoire/:histoire_id", avisController.getAvis);
router.post("/", avisController.postAvis);

module.exports = router;
