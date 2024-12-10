const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401);
      throw new Error("Token is missing or invalid");
    }

    // Verify
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized or token is expired");
      }
      req.user = decoded.user;
      next();
    });
  } else {
    res.status(401);
    throw new Error("Authorization header is missing or malformed");
  }
});

module.exports = validateToken;
