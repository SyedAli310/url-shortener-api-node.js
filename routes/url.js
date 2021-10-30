const express = require('express');
const router = express.Router();

//controller
const {shortenUrl} = require('../controllers/url');

//routes
router.route('/shorten').post(shortenUrl)

module.exports = router