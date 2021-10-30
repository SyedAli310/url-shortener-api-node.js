const Url = require("../models/Url");

const visitsCounter = async (code) => {
  try {
    const date = new Date().toISOString();
    const url = await Url.findOneAndUpdate(
      { urlCode: code },
      {
        $push: {
          visits: {
            date: date,
            count: 1,
          },
        },
      }
    );
    if (url) {
      console.log("Visists updated");
      //res.json(url)
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = visitsCounter;
