const express = require('express');
const router = express.Router();
const { signalerHistoire } = require('../controllers/ControllerSignaler');

router.post('/', signalerHistoire);

module.exports = router;
