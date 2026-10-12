import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

// Shape of the user data we send to the browser (never the password)
const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address,
});

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // Role is NOT read from the request: everyone who registers is a USER
    const user = await User.create({ name, email, password });

    res.status(201).json({ ...userResponse(user), token: generateToken(user._id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create account" });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // +password brings back the hidden field so we can compare
    const user = await User.findOne({ email }).select("+password");

    // Same message for "no such email" and "wrong password" so attackers can't tell which
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ ...userResponse(user), token: generateToken(user._id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not log in" });
  }
};

// GET /api/auth/me (protected)
export const getMe = (req, res) => {
  res.json(userResponse(req.user));
};

// PUT /api/auth/profile  body: { name, address }
export const updateProfile = async (req, res) => {
  try {
    const { name, address = {} } = req.body;

    // We pick each field by name, so nothing else (like role) can be changed here
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        address: {
          street: address.street || "",
          city: address.city || "",
          state: address.state || "",
          postalCode: address.postalCode || "",
          country: address.country || "",
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    res.json(userResponse(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update profile" });
  }
};

// PUT /api/auth/password  body: { currentPassword, newPassword }
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // +password brings back the hidden hash so we can check the old password
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // The pre-save hook in User.js hashes the new password automatically
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not change password" });
  }
};

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// POST /api/auth/forgot-password  body: { email }
export const forgotPassword = async (req, res) => {
  // Same reply every time, so the response never reveals whether an email exists
  const genericReply = {
    message: "If an account with that email exists, a reset link has been created.",
  };

  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = hashToken(token);
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save({ validateBeforeSave: false });

      // DEV ONLY: no email service yet, so print the link in the server terminal.
      // In production this would be sent by email and never logged.
      if (process.env.NODE_ENV !== "production") {
        console.log(`\nPassword reset link for ${user.email}:`);
        console.log(`${process.env.CLIENT_URL}/reset-password/${token}\n`);
      }
    }
    res.json(genericReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not process request" });
  }
};

// POST /api/auth/reset-password/:token  body: { password }
export const resetPassword = async (req, res) => {
  try {
    console.log("Token length:", req.params.token.length, "Hash:", hashToken(req.params.token));
    
    const user = await User.findOne({
      resetPasswordToken: hashToken(req.params.token),
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired" });
    }

    user.password = req.body.password; // hashed by the pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not reset password" });
  }
};
