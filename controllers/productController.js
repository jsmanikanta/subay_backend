const Firm = require('../models/firm');
const Product=require('../models/product');
const multer=require('multer');
const path = require('path');
const mongoose=require('mongoose')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });

const addProduct =async(req,res)=>{
    try {
        const {productName, price,category, bestseller,description}=req.body
        const image=req.file ? req.file.filename : null;

        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        console.log(firmId);
        

        if(!firm){
            return res.status(404).json({error:"no firm found"});
        }
        const product=new Product({
            productName, price,category, bestseller,description,firm:firm._id
        })
        const savedproduct=await product.save();
        firm.products.push(savedproduct._id);
        await firm.save();

        res.status(200).json(savedproduct);
    } catch (error) {
        console.error("Error in addFirm:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getProductByFirm = async (req, res) => {
    try {
        console.log("Request Params:", req.params); // Debugging

        const firmId = req.params.firmId;

        if (!firmId) {
            return res.status(400).json({ error: "firmId is missing in the request URL" });
        }

        const firm = await Firm.findById(firmId);
        console.log("Firm found:", firm);

        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        const restaurantName = firm.firmName; // Moved here after firm existence check

        const products = await Product.find({ firm: firmId });

        res.status(200).json({ products, restaurantName });
    } catch (error) {
        console.error("Error in getProductByFirm:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


const deleteProductById = async(req, res) => {
    try {
        const productId = req.params.productId;
        console.log("Request Params:", req.params);
        
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = { addProduct: [upload.single('image'), addProduct],getProductByFirm,deleteProductById };