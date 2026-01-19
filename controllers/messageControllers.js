const User=require('../models/chatSchema')

const getMessages=async (req,res)=>{

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

}

const deleteMessage = async (req, res) => {
  try {
    const phno = req.phone;
    const { id,n } = req.params;
    console.log("bhai you came here",id,n)
    if (!phno || !id) {
      return res.status(400).send("Missing required fields");
    }

    let user;

    if (n === "1") {
      user = await User.findOneAndUpdate(
        { phone: phno },
        { $pull: { "messages.send": { _id: id } } },
        { new: true }
      );
    } else {
      user = await User.findOneAndUpdate(
        { phone: phno },
        { $pull: { "messages.received": { _id: id } } },
        { new: true }
      );
    }

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("Successfully deleted");
  } catch (err) {
    console.error("Delete message error:", err);
    return res.status(500).send("Something went wrong");
  }
};


module.exports={getMessages,deleteMessage}