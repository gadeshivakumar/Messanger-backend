const express=require('express')
const {login,signup, logout}=require('../controllers/authController')
const router=express.Router();


router.post('/login',login)
router.post('/register',signup)
router.delete('/logout',logout)

module.exports=router