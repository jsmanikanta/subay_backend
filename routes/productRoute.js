const express=require('express');
const firmController=require('../controllers/productController');
const productController = require('../controllers/productController'); 

const router=express.Router();

router.post('/addproduct/:firmId',productController.addProduct);

router.get('/:firmId', productController.getProductByFirm);

router.get('/uploads/:imagename',(req,res)=>{
    const imagename=req.params.imagename;
    res.headerSent('Content-Type',image/jpeg);
    res.sendFile(path.join(__dirname,'..','uploads',imagename))
});

module.exports=router;