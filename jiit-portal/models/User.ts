import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Fields from your screenshot
  employeeCode: { type: String, required: true, unique: true }, // Mapped from CODE (e.g., JIIT1068)
  name: { type: String, required: true },                       // Mapped from NAME
  department: { type: String },                                 // Mapped from DEPARTMENT
  designation: { type: String },                                // Mapped from DESIGNATION
  unit: { type: String },                                       // Mapped from UNITS

  // Auth Fields
  email: { type: String, required: true, unique: true },        // Required for OTP
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },                // False = first time login
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);