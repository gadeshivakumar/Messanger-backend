const mongo =require('mongoose')

function connectDB(){
    mongo.connect(process.env.MONGO_URI).then(() => {
      console.log('MongoDB connected');
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports=connectDB