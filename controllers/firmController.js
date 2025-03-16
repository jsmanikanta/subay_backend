const Firm = require('../models/firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : null;

        // Find vendor
        const vendor = await Vendor.findById(req.vendorId);
        console.log(vendorId);
        
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        // Create a new firm
        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        const savedFirm = await firm.save();

        // Update vendor with firm ID
        vendor.firm.push(savedFirm._id);
        await vendor.save(); // Ensure vendor is updated

        return res.status(200).json({
            message: 'Firm added successfully',
            firmId: savedFirm._id,
            vendorFirmName: savedFirm.firmName
        });

    } catch (error) {
        console.error("Error in addFirm:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const deleteFirmById = async(req, res) => {
    try {
        console.log("Request Params:", req.params);
        const firmId = req.params.firmId;

        const deletedProduct = await Firm.findByIdAndDelete(firmId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}


// Export with multer middleware for single image upload
module.exports = { addFirm: [upload.single('image'), addFirm,deleteFirmById] };
