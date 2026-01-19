const messageSchema=require('./messageSchema')
const reciveSchema=require('./receiveSchema')
const mongo =require('mongoose')
const schema=new mongo.Schema({
    username:String,
    password:String,
    phone:String,
    profile:String,
    contacts:[{
        name:String,
        phone:String
    }],
    messages:{
        send:[messageSchema],
        received:[reciveSchema]
    }
})

const User=new mongo.model("User",schema)

module.exports=User