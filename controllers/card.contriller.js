const Card = require("../models/Card"); // Import the Card model
const User = require("../models/User"); // Import the User model

// POST - create card
const createcard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const createdBy = req.locals.username;
    // First, finding the user who created the card by their username
    const user = await User.findOne({ username: createdBy });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Getting the total count of cards created by the user
    const cardCount = await Card.countDocuments({ createdBy: createdBy });

    // Processing the uploaded file if it exists
    let attachments = [];
    if (req.file) {
      attachments.push({
        file: req.file.path, // Using the file path for storage
        originalName: req.file.originalname,
      });
    }

    // Creating a new card
    const newCard = new Card({
      title,
      description,
      createdBy,
      order: cardCount + 1,
      attachments: attachments || [],
    });

    // Save the card to the database
    await newCard.save();

    return res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH - edit card
const editcard = async (req, res) => {
  try {
    const { title, description, attachments } = req.body;
    const { cardId } = req.params;
    const createdBy = req.locals.username;

    // Find the user who is trying to edit the card
    const user = await User.findOne({ username: createdBy });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the card to edit and ensure it was created by the user
    const card = await Card.findOne({ _id: cardId, createdBy: createdBy });

    if (!card) {
      return res
        .status(404)
        .json({ message: "Card not found or not created by the user" });
    }

    // Update the card's properties with the new values
    card.title = title || card.title;
    card.description = description || card.description;

    // Process the uploaded file if it exists
    if (req.file) {
      // Update the card's attachment with the new file information
      card.attachments = [
        {
          file: req.file.path,
          originalName: req.file.originalname,
        },
      ];
    }
    // Save the updated card
    await card.save();

    return res.status(200).json(card);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//DELETE - delete card
const deletecard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const createdBy = req.locals.username; // stored the userobj in locals in isAuth middleware

    // Find the user who is trying to delete the card
    const user = await User.findOne({ username: createdBy });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the card to delete and ensure it was created by the user
    const card = await Card.findOneAndDelete({
      _id: cardId,
      createdBy: createdBy,
    });

    if (!card) {
      return res
        .status(404)
        .json({ message: "Card not found or not created by the user" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//get - get cards
const getcards = async (req, res) => {
  try {
    // Use the Card model to fetch all cards from the database
    const cards = await Card.find().sort({ order: 1 });

    return res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCardOrder = async (req, res) => {
  try {
    const { updatedCardsOrder } = req.body;

    // Update the order property in the database
    for (let i = 0; i < updatedCardsOrder.length; i++) {
      const cardId = updatedCardsOrder[i];
      await Card.findOneAndUpdate({ _id: cardId }, { order: i });
    }

    return res.status(200).json({ message: "Card order updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createcard,
  editcard,
  deletecard,
  getcards,
  updateCardOrder,
};
