import rateLimit from "express-rate-limit";

// Applies to every /api request: stops floods from one IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600, // generous: a normal shopper never gets near this
  standardHeaders: "draft-7", // sends RateLimit headers so clients can see their budget
  legacyHeaders: false,
  message: { message: "Too many requests. Please slow down and try again shortly." },
});