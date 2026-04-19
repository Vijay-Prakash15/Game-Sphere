const validateRegister = (req, res, next) => {
  console.log("VALIDATION BODY:", req.body); // 👈 debug

  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  next();
};

module.exports = { validateRegister };