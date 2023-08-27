const Url = require("../models/Url");
const geoIp = require('geoip-lite');

const visitsCounter = async (code,ip) => {
  try {
    const date = new Date().toISOString();
    const url = await Url.findOneAndUpdate(
      { urlCode: code },
      {
        $push: {
          visits: {
            date: date,
            count: 1,
            ip: ip,
            region: ip === '::1' ? "NA" : geoIp.lookup(ip),
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
