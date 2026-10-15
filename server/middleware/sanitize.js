// Rejects any request whose body or query contains keys that MongoDB treats as
// operators ("$gt", "$ne", ...) or dotted paths ("a.b"). Our controllers also
// check types, so this is a second layer ("defense in depth").
const hasDangerousKey = (value) => {
  if (value && typeof value === "object") {
    return Object.entries(value).some(
      ([key, inner]) => key.startsWith("$") || key.includes(".") || hasDangerousKey(inner)
    );
  }
  return false;
};

const sanitize = (req, res, next) => {
  if (hasDangerousKey(req.body) || hasDangerousKey(req.query)) {
    return res.status(400).json({ message: "Invalid characters in request" });
  }
  next();
};

export default sanitize;