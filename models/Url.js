const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    urlCode: {
      type: String,
    },
    longUrl: {
      type: String,
      required: [true, "Please provide a URL to shorten."],
    },
    shortUrl: {
      type: String,
    },
    visits : [ 
      {
        date: {type:String }, 
        count: {type:Number},
      }
  ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
