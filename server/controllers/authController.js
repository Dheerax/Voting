const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Mock OTP Database
const otpStore = {};

exports.registerUser = async (req, res) => {
  try {
    const { name, aadhaarNumber, phoneNumber, faceDescriptor } = req.body;
    let photoUrl = "";

    if (req.file) {
      photoUrl = req.file.path;
    }

    // Check existing
    const existingUser = await User.findOne({ aadhaarNumber });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Parse faceDescriptor if sent as string
    let parsedDescriptor = faceDescriptor;
    if (typeof faceDescriptor === "string") {
      parsedDescriptor = JSON.parse(faceDescriptor);
    }

    const user = new User({
      name,
      aadhaarNumber,
      phoneNumber,
      faceDescriptor: parsedDescriptor,
      photoUrl,
    });

    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;
    const user = await User.findOne({ aadhaarNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate Mock OTP
    const otp = "1234"; // Fixed for Demo convenience
    otpStore[aadhaarNumber] = otp;

    console.log(`[Assuming SMS Sent] OTP for ${aadhaarNumber}: ${otp}`);

    // In production, integrate Twilio here
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { aadhaarNumber, otp } = req.body;

    if (otpStore[aadhaarNumber] === otp) {
      const user = await User.findOne({ aadhaarNumber });
      const token = jwt.sign(
        { id: user._id, aadhaarNumber },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      delete otpStore[aadhaarNumber]; // Clear OTP
      res.json({
        token,
        user: {
          name: user.name,
          aadhaarNumber: user.aadhaarNumber,
          faceDescriptor: user.faceDescriptor,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
