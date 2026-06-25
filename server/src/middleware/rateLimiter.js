const rateLimitCache = new Map();

// Custom in-memory rate limiter to protect API routes without extra npm dependencies
const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimitCache.has(ip)) {
      rateLimitCache.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const rateData = rateLimitCache.get(ip);

    if (now > rateData.resetTime) {
      rateData.count = 1;
      rateData.resetTime = now + windowMs;
      return next();
    }

    rateData.count++;
    if (rateData.count > limit) {
      return res.status(429).json({
        success: false,
        message: "Too many requests from this IP, please try again later."
      });
    }

    next();
  };
};

module.exports = rateLimiter;
