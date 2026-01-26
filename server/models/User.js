const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhaarNumber: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  faceDescriptor: { type: [Number], required: true }, // Array of 128 floats from face-api.js
  photoUrl: { type: String }, // Path to stored image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
