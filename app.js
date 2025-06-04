require('dotenv').config()
const express=require("express")
const bp=require("body-parser")
const cors=require("cors")
const session=require("express-session");
const mongo=require("mongoose")
const multer=require("multer")
const storage=require("./cloudinary")
const jwt=require('jsonwebtoken')
const cook=require('cookie-parser')
const bcrypt=require('bcrypt');
const app=express()
const {Server} =require('socket.io')
const {createServer}=require('http')
const pm=require('./socket_ids');
const { timeStamp } = require('console');

app.use(cors({origin:"https://messanger-liard.vercel.app",
    credentials:true
}))

app.use(cook())

app.use(bp.json())



app.use(session({
  secret: process.env.SESSION_SCR,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


const server=createServer(app)
const io=new Server(server,{
    cors:{
        origin:"https://messanger-liard.vercel.app",
        credentials:true
    }
})

io.use((socket,next)=>{
    const token=socket.handshake.auth.token;
    console.log(token.token);
    if(token){
    jwt.verify(token.token,process.env.Secret_key,(err,payload)=>{
        if(err){
            if (err) {
            console.log("JWT verification failed:", err.message);
            return next(new Error("Authentication failed"));
        }
        }
        socket.phone=payload.phone;
        next();
    })
}
else {
  next(new Error('No token found'));
}

})

mongo.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const messageSchema=new mongo.Schema({
    sendTo:String,
    message:String,
    timestamp: { type: Date, default: Date.now }
})
const reciveSchema=new mongo.Schema({
    from:String,
    message:String,
    timestamp:{type:Date,default:Date.now}
})
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

function authorize(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).send("no user is found")
    }
    jwt.verify(token,process.env.Secret_key,(err,payload)=>{
        if(err){
            return res.status(401).send("Invalid credentials");
        }
        req.phone=payload.phone;
        
        next();
    });

   

}

app.post("/login",async (req,res)=>{
    const {phone,password}=req.body
    const user=await User.findOne({phone:phone})
    if(!user){
        return res.status(404).send("Invalid Credentials");
    }
    if(await bcrypt.compare(password,user.password)){
        req.phone=phone;
        //jwt token creating here
        const token=jwt.sign({phone:phone},process.env.Secret_key);
        res.cookie("token", token, {
            maxAge: 50 * 24 * 60 * 60 * 1000,
            httpOnly: process.env.NODE_ENV==="production",
            secure: process.env.NODE_ENV==="production",
            sameSite: "none", 
        });
        
        return res.status(200).send("success")
    }
    res.status(401).send("Invalid Credentials")
})

app.post("/register", async (req,res)=>{
    const {username,password,phone}=req.body;
    const user1=await User.findOne({phone:phone})
    if(user1){
        return res.status(409).send("user already exists");
    }
    const user=new User({
        username:username,
        password:await bcrypt.hash(password,10),
        phone:phone,
        contacts:[],
        message:[]
    })
    user.save().then(()=>{
        res.status(200).send("successfully registered");
    }).catch((err)=>{
        res.status(401).send("Cant register user Try again");
    })
})

app.get("/con",authorize, async (req, res) => {
    const phno = req.phone;
    if (!phno) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ phone: phno });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user.contacts); 
});

app.post("/add",authorize,async (req,res)=>{

    const phno=req.phone;
    const {phone,name}=req.body;
    const user=await User.findOne({phone:phone})
    if(phno && user){
        await User.updateOne(
            {phone:phno},
            {
                $push:{contacts:{name:name,phone:phone}}
            }
        )
    res.status(200).send("added Successfully")
    }
    else{
    res.status(404).send("user not found")
    }
    
})

app.delete("/logout",(req,res)=>{
    res.clearCookie("token", {
  httpOnly: process.env.NODE_ENV === "production",
  secure: process.env.NODE_ENV === "production",
  sameSite: "none"
});

    return res.status(200).json({ message: 'Logout successful' });
    
})


app.post("/delete",authorize,async (req,res)=>{
    const phno=req.phone;
    const {phone}=req.body;
    
    try{
        const updates=await User.findOneAndUpdate(
                {phone:phno},
                {
                    $pull:{contacts:{phone:phone}}
                }
        )
        if(!updates){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Contact deleted", user: updates });
    }
    catch(err){
        res.status(400).send(err)
    }
})


app.post("/profile",authorize, storage.single("dp"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }
    const path=req.file.path;
    const phone=req.phone;
    try{
        
        const added=await User.findOneAndUpdate({phone:phone},{profile:path})
        if(!added){
            return res.status(404).send("user not found");
        }

    }
    catch(err){
        return res.status(404).send("user not found");
    }
    res.status(200).json("success");
});


app.get("/getDetails",authorize,async (req,res)=>{
    const phone=req.phone;
    const user=await User.findOne({phone:phone});
    try{
        const user=await User.findOne({phone:phone})
        if(!user){
            return res.status(404).send("error")
        }
        return res.status(200).json({name:user.username,phone:user.phone,profile:user.profile})
    }
    catch(err){
        return res.status(404).send(err)
    }
})

app.post("/getDetails1",authorize,async (req,res)=>{
    const {phone}=req.body;
    const user=await User.findOne({phone:phone});
    try{
        const user=await User.findOne({phone:phone})
        if(!user){
            return res.status(404).send("error")
        }
        return res.status(200).json({name:user.username,phone:user.phone,profile:user.profile})
    }
    catch(err){
        return res.status(404).send(err)
    }
})


// app.post("/message",authorize,async (req,res)=>{
//     const phno=req.phone;
//     const {phone,message}=req.body;
//     try{
//          const mess=await User.findOneAndUpdate(
//             {phone:phno},
//             {$push:{messages:{sendTo:phone,message:message}}}
//          )

//          if(!mess){
//             return res.status(500).send("there is a trouble try again!!!");
//          }
//          else{
//             return res.status(200).send("successfully sent message");
//          }
//     }
//     catch(err){
//         return res.status(500).send("error occured")
//     }
// })

io.on('connection',(socket)=>{

    pm.set(socket.phone,socket.id)

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

    socket.on('disconnect',()=>{
        pm.delete(socket.phone)
    })

    

})

app.post("/getMessages",authorize,async (req,res)=>{

    const userp=req.phone;
    const {phone}=req.body;
    try{

        const user1=await User.findOne({phone:userp})

        if(!user1){
            return res.status(404).send("sender not found")
        }
        const m1=user1.messages.send.filter(m=>m.sendTo===phone)


        const m11=m1.map((m)=>{
            return (
            { n:1,
              message:m.message,
              time:m.timestamp,
              id:m._id
            }
        )
        })

        const user2=await User.findOne({phone:userp})

        if(!user2){
            return res.status(404).send("Reciver not found");
        }
        const m2=user2.messages.received.filter((m)=>m.from===phone)

        const m12=m2.map((m)=>{
            return (
            { n:2,
              message:m.message,
              time:m.timestamp,
              id:m._id
            }       
        )
        })

        const mess=m11.concat(m12).sort((a,b)=>new Date(a.time)-new Date(b.time))

        
        return res.status(200).json(mess);


    }

    catch(err){
        return res.status(500).send(`error occured ${err}`)
    }

})

app.get("/islogin",authorize,(req,res)=>{
    if(req.phone){
      return res.status(200).json({token:req.cookies.token});
    }
    else{
        return res.status(401).send("not logged in");
    }

}
)

app.delete("/delMessage",authorize,async (req,res)=>{
    const phno=req.phone;
    const {phone,id,n}=req.body
    if(n===1){
    const user=await User.findOneAndUpdate({phone:phno},
                                {$pull:{'messages.send':{_id:id}}})

        if(user){
            return res.status(200).send("successfull deleted")
        }
        else{
            return res.status(500).send("some err");
        }

    }
    else{
        const user=await User.findOneAndUpdate({phone:phno},
                                {$pull:{'messages.received':{_id:id}}})

            if(user){
                return res.status(200).send("successfull deleted")
            }
            else{
                return res.status(500).send("some err");
            }
    }
    
})

const PORT=process.env.PORT || 5000

server.listen(PORT,()=>{
    console.log(`http server stated at port ${PORT}`)
})
