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
    slug:{
      type: String,
      required: [true, "Please provide a slug."],
    },
    visits : [ 
      {
        date: {type:String }, 
        count: {type:Number},
        ip: {type:String},
      }
  ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
