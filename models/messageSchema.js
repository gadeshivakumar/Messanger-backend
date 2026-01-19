const mongo=require('mongoose')
const messageSchema=new mongo.Schema({
    sendTo:String,
    message:String,
    timestamp: { type: Date, default: Date.now }
})

module.exports=messageSchema