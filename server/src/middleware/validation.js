const validateRegister = (req, res, next) => {
  console.log("VALIDATION BODY:", req.body); // 👈 debug

  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  // Password length validation
  if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters long" });
  }

  next();
};

module.exports = { validateRegister };