const User=require('../models/chatSchema')

const contacts=async (req, res) => {
    const phno = req.phone;
    if (!phno) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ phone: phno });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user.contacts); 
}

const addContact=async (req,res)=>{

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
    
}

const deleteContact=async (req,res)=>{

    try{
        const phno=req.phone;
        const {number}=req.params;
        console.log("came here bro it over to you",number)
        const updates=await User.findOneAndUpdate(
                {phone:phno},
                {
                    $pull:{contacts:{phone:number}}
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
}

const updateProfile=async (req, res) => {

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
}

const userDetails=async (req,res)=>{
        const {phone}=req.params || req.phone;
        // const user=await User.findOne({phone:phone});
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
}

module.exports={contacts,addContact,deleteContact,userDetails,updateProfile}