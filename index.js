// impoting express
const express = require("express");
const dotenv = require("dotenv");

// importing dotenv for mongodb
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importing body parser
const bodyparser = require("body-parser");
//importing mongodb
const mongodb = require("mongoose");
mongodb
  .connect(process.env.mongo_url)
  .then(() => {
    console.log("database connected sucessfully");
  })
  .catch((err) => {
    console.log(err);
  });

const vendorRoutes = require('./routes/vendorRoute');
const firmRoutes=require('./routes/frimRoutes');
const productRoutes=require('./routes/productRoute');
const cors=require('cors');
const path=require('path')


// creating routes
app.use("/", (req, res) => {
  res.send(`Welcome to SUBAY`);
  console.log("home page opened");
});
app.use(bodyparser.json());
// using vendor route
app.use("/vendor", vendorRoutes);
// using firm route
app.use("/firm",firmRoutes)
app.use("/product",productRoutes);
app.use("/uploads",express.static('uploads'));

// giving a port
const port = process.env.port||1310;
// creating server
app.listen(port, (req, res) => {
  console.log("running server sucessfully at ", port);
});