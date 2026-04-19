const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // 🔥 Bearer remove karo
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verified.userId;
    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};