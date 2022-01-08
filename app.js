//Express app for TopNewsAmerica

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const morgan = require("morgan");
const { authenticateJWT } = require("./middleware/auth");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);
app.use(routes);

// Generic error handler 
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
  
  // Handle 404 errors
  app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  
  
module.exports = app;
  