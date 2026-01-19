const mongo=require('mongoose')
const { timeStamp } = require('console');
const reciveSchema=new mongo.Schema({
    from:String,
    message:String,
    timestamp:{type:Date,default:Date.now}
})

module.exports=reciveSchema