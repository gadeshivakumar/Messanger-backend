require('dotenv').config()
const express=require("express")
const bp=require("body-parser")
const cors=require("cors")
const session=require("express-session");
const cook=require('cookie-parser')
const app=express()
const {Server} =require('socket.io')
const {createServer}=require('http')
const pm=require('./socket_ids');
const socketAuthorize=require('./middlewares/socketAuthorize')
const connectDB=require('./config/connectDB')
const authRouter=require('./routers/authroutes')
const userRouter=require('./routers/userRoutes')
const path=require('path')

connectDB()

const User =require('./models/chatSchema')

// app.use(cors(
//     {
//         origin:process.env.ORIGIN,
//         credentials:true,
//         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowedHeaders: ["Content-Type", "Authorization"]
//     }
// ))

app.use(cook())

app.use(bp.json())





const server=createServer(app)

const io=new Server(server,{
    cors:{
        origin:process.env.ORIGIN,
        credentials:true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
})


io.use(socketAuthorize)

function broadcastOnlineUsers() {
    io.emit("online_users", [...pm.keys()]);
}

io.on('connection',(socket)=>{

    pm.set(socket.phone,socket.id)

    broadcastOnlineUsers();

    socket.on('send_message',async ({phone,message})=>{
        try{
        
        const mess=await User.findOneAndUpdate(
            {phone:socket.phone},
            {$push:{'messages.send':{sendTo:phone,message:message}}},
            {new:true}    
        )

        const mess1=await User.findOneAndUpdate(
            {phone:phone},
            {$push:{'messages.received':{from:socket.phone,message:message}}},
            {new:true}
        )

       
        if(mess){
            m=mess.messages.send.at(-1);
            socket.emit("sent",m);
        }
        if(mess1 && pm.has(phone)){
            m=mess1.messages.received.at(-1);
            io.to(pm.get(phone)).emit("akn",m);
        }

        }
        catch(err){
            console.log(err);
        }
    })

    socket.on("del",()=>{
        socket.emit("deleted");
    })

    socket.on("disconnect", () => {
  pm.delete(socket.phone);

  broadcastOnlineUsers();
});

    

})



app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.use(express.static(path.join(__dirname, "client/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

const PORT=process.env.PORT || 5000

server.listen(PORT,()=>{
    console.log(`http server stated at port ${PORT}`)
})
