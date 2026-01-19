const express=require('express')
const {contacts, addContact, deleteContact, updateProfile, userDetails}=require('../controllers/userControllers')
const authorize=require('../middlewares/authorize')
const { getMessages, deleteMessage } = require('../controllers/messageControllers')
const { islogin } = require('../controllers/authController')
const storage=require("../cloudinary")
const router=express.Router()

router.get('/con',authorize,contacts)
router.post("/add",authorize,addContact)
router.delete('/delete/:number',authorize,deleteContact)
router.post("/profile",authorize, storage.single("dp"),updateProfile);
router.get("/getDetails/:phone",authorize,userDetails)
router.post("/getMessages",authorize,getMessages)
router.get("/islogin",authorize,islogin)
router.delete("/:phone/delMessage/:n/:id",authorize,deleteMessage)

module.exports=router