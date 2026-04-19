const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
// REGISTER
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = email.toLowerCase();

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const nameExist = await User.findOne({ name });
    if (nameExist) {
      return res.status(400).json({ msg: "Name already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // 🔥 ADD THIS (TOKEN GENERATION)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 RETURN TOKEN + USER
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🔹 Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // normalize email
    email = email.toLowerCase();

    // 🔹 Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🔹 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🔹 Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        issuer: "your-app-name",
      }
    );

    // 🔹 Response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};