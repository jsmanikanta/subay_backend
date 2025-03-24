// Importing Express
const express = require("express");
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing body-parser
const bodyparser = require("body-parser");

// Importing mongoose for MongoDB
const mongoose = require("mongoose");

// Connecting to MongoDB
require("dotenv").config();

// Check if MongoDB URL exists
if (!process.env.MONGO_URL) {
  console.error("MONGO_URL is missing. Check your environment variables.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));


// Importing CORS and Path modules
const cors = require("cors");
const path = require("path");

// Importing routes
const vendorRoutes = require("./routes/vendorRoute");
const firmRoutes = require("./routes/frimRoutes");
const productRoutes = require("./routes/productRoute");

// Applying CORS middleware before defining routes
app.use(cors());

// Applying body-parser middleware
app.use(bodyparser.json());

// Creating home route
app.get("/home", (req, res) => {  // Removed extra space in "/home "
  res.send("Welcome to SUBAY");
  console.log("Home page opened");
});

// Using vendor route
app.use("/vendor", vendorRoutes);

// Using firm route
app.use("/firm", firmRoutes);

// Using product route
app.use("/product", productRoutes);

// Serving static uploads folder
app.use("/uploads", express.static("uploads"));

// Defining the port (fixed variable name)
const port = process.env.PORT || 1310;

// Creating server
app.listen(port, () => {
  console.log(`Running server successfully at port ${port}`);
});
