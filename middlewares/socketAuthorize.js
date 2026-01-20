const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const socketAuthorize = (socket, next) => {
  try {
    const rawCookie = socket.handshake.headers.cookie;

    if (!rawCookie) {
      return next(new Error("No cookies found"));
    }

   
    const cookies = cookie.parse(rawCookie);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Token not found"));
    }


    const payload = jwt.verify(token, process.env.Secret_key);


    socket.phone = payload.phone;

    return next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    return next(new Error("Authentication failed"));
  }
};

module.exports = socketAuthorize;
