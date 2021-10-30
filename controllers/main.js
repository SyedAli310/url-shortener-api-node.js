require("dotenv").config();
const Url = require("../models/Url");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
//middleware
const visitsCounter = require("../middleware/visits");

const redirectUrl = async  (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
        visitsCounter(req.params.code)
      return res.redirect(url.longUrl);
    } else {
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
