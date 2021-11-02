const express = require('express');
const router = express.Router();

//controller
const {shortenUrl} = require('../controllers/url');
const {searchUrl} = require('../controllers/url');

//routes
router.route('/shorten').post(shortenUrl)

router.route('/search').get(searchUrl)

module.exports = router