const Url = require("../models/Url");
const ipInfo = require("ip-info-finder");

const visitsCounter = async (code,ip) => {
  try {
    const date = new Date().toISOString();
    let ipToAdd;
    if(ip === '::1') {
      ipToAdd = "NA";
    } else {
      ipToAdd = await ipInfo.getIPInfo('180.94.33.58');
    }
    const url = await Url.findOneAndUpdate(
      { urlCode: code },
      {
        $push: {
          visits: {
            date: date,
            count: 1,
            ip: ip,
            region: ipToAdd,
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
