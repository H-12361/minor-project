const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
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
  price: {
    type: Number,
    default: 0,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// ⭐ Correct middleware — before delete
listingSchema.pre("findOneAndDelete", async function(next) {
  const listing = await this.model.findOne(this.getQuery());
  if (listing) {
    await Review.deleteMany({ listing: listing._id });
  }
  next();
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
