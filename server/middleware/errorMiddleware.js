// Runs when no route matches (replaces the inline 404 in server.js)
export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Express recognises an error handler by its FOUR parameters: keep all of them
export const errorHandler = (err, req, res, next) => {
  // Malformed JSON in the request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  // Body larger than the limit we set
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }
  // Mongoose: id in the wrong format
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id format" });
  }
  // Mongoose: schema validation failed
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors)[0].message });
  }
  // MongoDB: unique field already used
  if (err.code === 11000) {
    return res.status(400).json({ message: "That value is already in use" });
  }

  // Anything else is our bug: log the details, hide them from the client
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: status === 500 ? "Something went wrong on the server" : err.message,
  });
};