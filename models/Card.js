const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
  },
  attachments: [
    {
     
      file: {
        type: String, // Store the path or URL to the attached file
        required: false,
      },
      originalName: {
        type: String, // Store the original filename
        required: false,
      },
    },
  ],
  order: {
    type: Number, 
    required: true,
  },
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
