// models/Admin.js - SIMPLE VERSION
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin", "super-admin"],
    },
  },
  { timestamps: true }
);

// No pre-save hook - we'll hash manually in createDefaultAdmin
adminSchema.methods.comparePassword = async function (candidatePassword) {
  // Simple comparison for now
  return candidatePassword === this.password;
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;