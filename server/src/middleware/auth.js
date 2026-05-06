const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FIX HERE
    req.user = {
      id: verified.userId,
      name: verified.name // (agar token me hai)
    };

    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};