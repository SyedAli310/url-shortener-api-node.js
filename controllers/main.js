require("dotenv").config();
const Url = require("../models/Url");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
//middleware
const visitsCounter = require("../middleware/visits");

const redirectUrl = async (req, res) => {
  try {
    let { code } = req.params;
    const url = await Url.findOne({ urlCode: code });
    const SlugUrl = await Url.findOne({ slug: code});
    if (url) {
      visitsCounter(req.params.code, req.ip);
      return res.redirect(url.longUrl);
    }
    else if (SlugUrl) {
      visitsCounter(SlugUrl.urlCode, req.ip);
      return res.redirect(SlugUrl.longUrl);
    } 
    else {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: getReasonPhrase(StatusCodes.NOT_FOUND) + " No URL found!",
      });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg:
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) +
        "Something went wrong!",
    });
  }
};

module.exports = {
  redirectUrl,
};
