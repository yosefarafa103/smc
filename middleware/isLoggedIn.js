const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  console.log(req.cookies);
  
  if (req.cookies.jwt) {
    const isValid = jwt.verify(req.cookies.jwt, process.env.DB_PASS);
    // console.log(isValid);
   return next();
  }
  next("Please Make Sure Your Logged In");
};
