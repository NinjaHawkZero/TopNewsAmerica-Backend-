
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError} = require("../expressError");



// Middleware: Authenticate user. 
function authenticateJWT(req, res, next) {
    try {
      const authHeader = req.headers && req.headers.authorization;
      if(authHeader) {
      const token = authHeader;
      const payload = jwt.verify(token, SECRET_KEY);
      res.locals.user = payload; // create a current user
      }
      return next();
    } catch (err) {
      return next();
    }
  }


//Middleware to use when they must be logged in.

 function ensureLoggedIn(req, res, next) {
    try {
      if (!res.locals.user) throw new UnauthorizedError();
      return next();
    } catch (err) {
      return next(err);
    }
  }



  function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    console.log("Hey: ", user)
    if ((!user) && (user.username != req.params.username)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {ensureCorrectUser, ensureLoggedIn, authenticateJWT};