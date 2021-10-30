const express = require('express');
const router = express.Router();



//controller
const {redirectUrl} = require('../controllers/main');

//routes
router.route('/:code').get(redirectUrl)

module.exports = router