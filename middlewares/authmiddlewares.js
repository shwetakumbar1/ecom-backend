const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuth =async(req,res,next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json( {
                message: "No token provided, authorization denied",
            });
        }
    

const decoded = jwt.verify(token,process.env.JWT_SECRET);
req.user = await User.findById(decoded.userId).select("-password");

next();
}
catch(error) {
console.error("Authentication error:",error);
res.status(401).json({
    message:"Invalid token, authorization denied",
});
}
}
const isAdmin =(req,res,next) =>{
    if(req.user && req.user.role === "admin") {
        next();

    }
    else {
        res.status(403).json({
            message: "Access denied, admin privileges required",
        });
    }
};

module.exports = { isAuth, isAdmin};