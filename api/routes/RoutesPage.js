const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware");
const pageCtrl = require("../controllers/ControllerPage");

router.post("/", verifyToken, pageCtrl.create);
router.get("/:histoireId", verifyToken, pageCtrl.getAllForHistoire);
router.put("/:id", verifyToken, pageCtrl.update);
router.delete("/:id", verifyToken, pageCtrl.remove);

module.exports = router;
