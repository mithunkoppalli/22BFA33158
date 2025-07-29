// Middleware to decode Bearer token and attach user info

const jwt = require('jsonwebtoken');

const EXPECTED_CLIENT_ID = "d4196731-9d0c-414c-abcb-7b7ed0d66584";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token);

    if (!decoded || decoded.clientID !== EXPECTED_CLIENT_ID) {
      return res.status(403).json({ error: 'Invalid clientID' });
    }

    req.user = {
      name: decoded.name || "koppalli mithun",
      email: decoded.email || "2022csm.r158@svce.edu",
      rollNo: decoded.rollNo || "22bfa33158",
      accessCode: decoded.accessCode || "PrjyQF",
      clientID: decoded.clientID || "d4196731-9d0c-414c-abcb-7b7ed0d66584",
      clientSecret: decoded.clientSecret || "GWkfkfMjqrZmdEdZ"
    };

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Token decode error' });
  }
};

module.exports = authMiddleware;
