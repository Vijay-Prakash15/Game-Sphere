module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({ success: false, message: `This ${field} is already in use` });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Resource not found or invalid format" });
  }

  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || "Server error" 
  });
};