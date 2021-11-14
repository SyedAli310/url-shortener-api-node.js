require("dotenv").config();
const Url = require("../models/Url");
const validUrl = require("valid-url");
const shortId = require("shortid");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const { generateSlug } = require("random-word-slugs");


const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  let { slug } = req.body;
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
        if (slug) {
          slug = slug.trim();
          slug = slug.replace(/\s/g, '')
          console.log(slug);
          let checkSlug = await Url.findOne({ slug });
          if (checkSlug) {
            //send error
            console.log(`Slug ${slug} already exists!`);
            res.status(StatusCodes.BAD_REQUEST).json({
              msg:
                getReasonPhrase(StatusCodes.BAD_REQUEST) +
                ` Slug ${slug} already exists!`,
              conflictingRecord: checkSlug,
            });
          } else {
            //create URL with slug
            const urlCode = shortId.generate();
            const shortUrl = baseUrl + "/" + slug;
            url = new Url({
              longUrl,
              shortUrl,
              urlCode,
              slug,
              date: new Date(),
            });
            await url.save();
            res
              .status(StatusCodes.CREATED)
              .json({ msg: getReasonPhrase(StatusCodes.CREATED), url });
          }
        } else {
          //create URL with urlCode
          const urlCode = shortId.generate();
          const shortUrl = baseUrl + "/" + urlCode;
          const defaultSlug = generateSlug(2,{
            format: "kebab",
            categories: {
              noun: ["technology"]
            },
          });
          url = new Url({
            longUrl,
            shortUrl,
            urlCode,
            slug: defaultSlug,
            date: new Date(),
          });
          await url.save();
          res
            .status(StatusCodes.CREATED)
            .json({ msg: getReasonPhrase(StatusCodes.CREATED), url });
        }
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg:
          getReasonPhrase(StatusCodes.BAD_REQUEST) + " Invalid url provided.",
      });
    }
  } catch (err) {
    //console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) + err.message,
    });
  }
};

const searchUrls = async (req, res) => {
  const { query } = req.query;
  if (query) {
    try {
      const urls = await Url.find({ slug: { $regex: query, $options: "i" } });
      if (urls) {
        res.status(StatusCodes.OK).json({
          msg: getReasonPhrase(StatusCodes.OK),
          length: urls.length,
          urls,
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          msg:
            getReasonPhrase(StatusCodes.NOT_FOUND) +
            ` No URL with ${query} as slug found!`,
        });
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) + err.message,
      });
    }
  }
};

const getOneUrl = async (req, res) => {
  const { code } = req.params;
  if (code) {
    try {
      const url = await Url.findOne({ urlCode: code });
      if (url) {
        res
          .status(StatusCodes.OK)
          .json({ msg: getReasonPhrase(StatusCodes.OK), url });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          msg: ` No URL with ${code} as URL code found!`,
        });
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) + err.message,
      });
    }
  }
};

const getAllUrls = async (req, res) => {
    try {
      const urls = await Url.find();
      if (urls) {
        res
          .status(StatusCodes.OK)
          .json({ msg: getReasonPhrase(StatusCodes.OK),totalUrls:urls.length, urls });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          msg: ` No URL's found`,
        });
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) + err.message,
      });
  }
};

module.exports = {
  shortenUrl,
  searchUrls,
  getOneUrl,
  getAllUrls,
};
