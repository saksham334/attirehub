import { validationResult } from "express-validator";

// Stops the request with a 400 if any validation rule failed
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

export default validate;