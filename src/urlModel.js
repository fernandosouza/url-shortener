const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
  slug: {
    type: String
  },
  url: {
    type: String
  }
});

const UrlModel = mongoose.model('URL', URLSchema);

module.exports = UrlModel;