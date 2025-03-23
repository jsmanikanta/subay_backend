const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

// Correct secret key usage
const secretKey = process.env.JWT_SECRET;

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if email already exists
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new vendor
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    // Save vendor to database
    await newVendor.save();
    res.status(201).json({ success: "Vendor registered successfully" });
    console.log("Vendor registered");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find vendor by email
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Corrected JWT token generation
    const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
      expiresIn: "1h",
    });

    // Send success response with token
    res.status(200).json({ success: "Login successful", token });

    console.log(email, "Token:", token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// getting data all vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    res.json({ vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// get data of each vendor
const getVendorById = async (req, res) => {
  const vendorId = req.params.apple;

  try {
    const vendor = await Vendor.findById(vendorId).populate("firm");
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    const vendorFirmId = vendor.firm[0]._id;
    res.status(200).json({vendorFirmId});
    console.log(vendorFirmId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
