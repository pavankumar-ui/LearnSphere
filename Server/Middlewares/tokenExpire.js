const jwt = require('jsonwebtoken');


const TokenExpire = (err,req,res,next) =>{

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    const currentTime = Math.floor(Date.now() / 1000);
    if(decodedToken.exp < currentTime){
        return res.status(401).json({
            "message":"Token expired, please login again",
            "success":false
        });
    }
    next(err);
}

module.exports = TokenExpire;