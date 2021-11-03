const express = require('express');
const router = express.Router();

//controller
const {shortenUrl,getOneUrl,searchUrls} = require('../controllers/url');

//routes
router.route('/search/:code').get(getOneUrl)
router.route('/shorten').post(shortenUrl)
router.route('/search').get(searchUrls)

module.exports = router