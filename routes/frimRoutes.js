const express=require('express');
const firmController=require('../controllers/firmController');
const verifyToken=require('../middlewares/verifytoken');

const router=express.Router();

router.post('/addfirm',verifyToken,firmController.addFirm);

router.get('/uploads/:imagename',(req,res)=>{
    const imagename=req.params.imagename;
    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(path.join(__dirname,'..','uploads',imagename))
});
module.exports=router;