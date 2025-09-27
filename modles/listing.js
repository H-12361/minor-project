const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title:{ type: String, required:true },
  description: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    set: (v) => {
      if (!v) {
        return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
      }
      if (typeof v === "object" && v.url) {
        return v.url;
      }
      return v;
    },
  },
  price:{
    type:Number,
    default: 0

  } ,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
