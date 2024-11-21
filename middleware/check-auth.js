const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const verifyToken = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError("Authentication failed!", 403);
    }

    const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // Attach user information from the token to the request
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next(); // Allow access to the next middleware or route handler
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};

module.exports = verifyToken;
