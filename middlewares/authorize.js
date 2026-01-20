const jwt=require('jsonwebtoken')

function authorize(req,res,next){
    
    const token = req.cookies?.token
    console.log(token);
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

module.exports=authorize