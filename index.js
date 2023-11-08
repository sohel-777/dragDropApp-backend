const express = require("express");
require("dotenv").config();
const cors = require("cors");

//file imports
const db = require("./config/db");
const userRoutes = require("./routes/user");
const cardRoutes = require("./routes/card")


const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// routes
app.use("/user", userRoutes);
app.use("/card", cardRoutes);



app.listen(PORT, () => {
  console.log("Server is running at port: ", PORT);

});
