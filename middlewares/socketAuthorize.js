const jwt=require('jsonwebtoken')

const socketAuthorize=(socket,next)=>{
    const token=socket.handshake.auth.token;
    if(token){
        jwt.verify(token,process.env.Secret_key,(err,payload)=>{
            if(err){
                if (err) {
                console.log("JWT verification failed:", err.message);
                return next(new Error("Authentication failed"));
            }
            }
            socket.phone=payload.phone;
            return next();
        })
}
else {
  return next(new Error("token not found"));
}

}

module.exports=socketAuthorize