const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  let token = req.cookies.token;
  
  if (!token && req.headers["authorization"]) {
    token = req.headers["authorization"].replace("Bearer ", "");
  }
  
  if (!token) return res.status(401).json({ message: "Non authentifié" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
}

module.exports = verifyToken;