require("dotenv").config();
const Url = require("../models/Url");
const validUrl = require("valid-url");
const shortId = require("shortid");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL;
  if (!validUrl.isUri(baseUrl)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: getReasonPhrase(StatusCodes.BAD_REQUEST) });
  }

  try {
    if (validUrl.isUri(longUrl) && longUrl) {
      let url = await Url.findOne({ longUrl });
      if (url) {
        res
          .status(StatusCodes.OK)
          .json({ msg: getReasonPhrase(StatusCodes.OK), url });
      } else {
        //create urlCode
        const urlCode = shortId.generate();
        const shortUrl = baseUrl + "/" + urlCode;
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });
        await url.save();
        res
          .status(StatusCodes.CREATED)
          .json({ msg: getReasonPhrase(StatusCodes.CREATED), url });
      }
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          msg:
            getReasonPhrase(StatusCodes.BAD_REQUEST) +
            " Invalid url provided.",
        });
    }
  } catch (err) {
    //console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) + err.message });
  }
};

module.exports = {
  shortenUrl,
};
