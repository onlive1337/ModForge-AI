const express = require('express');
const router = express.Router();
const { generateModpackFromPrompt } = require('../controllers/modpackController');

router.post('/generate', generateModpackFromPrompt);

module.exports = router;