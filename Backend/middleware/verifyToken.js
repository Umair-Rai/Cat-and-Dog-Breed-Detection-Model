const jwt = require("jsonwebtoken");

module.exports = (requiredRole) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });

    req.user = decoded; // { id, role }

    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
    }

    next();
  });
};
