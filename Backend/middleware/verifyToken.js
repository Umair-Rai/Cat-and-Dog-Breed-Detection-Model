const jwt = require("jsonwebtoken");

module.exports = (requiredRole) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      req.user = decoded; // { id, role }

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
      }

      next();
    });
  } catch (error) {
    console.error('Token middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// The middleware might be hanging - ensure it has proper error handling
const verifyToken = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token required' });
      }
      
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      req.user = decoded;
      
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};
