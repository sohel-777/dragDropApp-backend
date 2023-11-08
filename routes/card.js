const express = require("express");
const {
    createcard,
    editcard,
    deletecard,
    getcards,
    updateCardOrder,
} = require("../controllers/card.contriller");
const { isAuth } = require("../middlewares/AuthMiddleware");
const upload = require('../fileUpload');
const app = express();

app.post("/create-card", isAuth, upload.single('file'), createcard);
app.patch("/edit-card/:cardId", isAuth, upload.single('file'), editcard);
app.delete("/delete-card/:cardId", isAuth, deletecard);
app.get("/get-all-cards", isAuth, getcards)

app.patch('/update-card-order',  updateCardOrder);
module.exports = app;