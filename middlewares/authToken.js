const Jwt = require("jsonwebtoken");
const JWT_SECRET = "badal_e-comm";

const generateToken = (id) => {
  return Jwt.sign( {id} , JWT_SECRET, { expiresIn: "2h" });
};

const veriFyAuthToken = (req, res, next) => {
  // Get the token from the Authorization header (Bearer token)
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  // Verify the token
  Jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    req.user = decoded
    // Attach the decoded user info to the request object
    // req.user = decoded;
    next(); // Token is valid, proceed to the next middleware or route handler
  });
};

module.exports = {
  generateToken,
  veriFyAuthToken,
};
