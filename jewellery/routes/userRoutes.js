const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

//for FORGET password
const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📧 Forgot password request for:", email);

    // Clean email
    const cleanEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save hashed token to database
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();
    console.log("✅ Token saved for user:", user.email);

    // Create reset URL - use your frontend port
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // IMPORTANT: Use .env variables, NOT hardcoded values
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Beautiful email template
    await transporter.sendMail({
      from: `"Jewellery Store" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🔐 Reset Your Password - Jewellery Store",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0B6F73 0%, #0a5c5f 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">💎 Jewellery Store</h1>
            <p style="color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 14px;">Password Reset Request</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${user.name || 'there'}!</h2>
            <p style="color: #666; line-height: 1.6; font-size: 15px;">We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #0B6F73 0%, #0a5c5f 100%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(11,111,115,0.3);">Reset Password</a>
            </div>
            <p style="color: #999; font-size: 13px; line-height: 1.5;">If the button doesn't work, copy and paste this link in your browser:</p>
            <p style="color: #0B6F73; font-size: 13px; word-break: break-all;">${resetUrl}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
            <p style="color: #999; font-size: 12px;">⏰ This link expires in 1 hour.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px 30px; text-align: center;">
            <p style="color: #aaa; font-size: 11px; margin: 0;">© 2026 Jewellery Store. All rights reserved.</p>
          </div>
        </div>
      `
    });

    console.log("✅ Email sent to:", user.email);
    res.json({ message: "Reset link sent to email" });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});


router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.params.token;

    // Hash token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// ✅ Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    console.log('📝 Registration attempt for email:', email);
    console.log('Request body:', { name, email, phone, password: '***' });
    

    // Validate input
    if (!name || !email ||
       !password || !phone) {
      console.log('❌ Missing fields:', { name: !!name, email: !!email, password: !!password, phone: !!phone });
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Create new user
    const user = new User({
  name: name.trim(),
  email: email.toLowerCase().trim(),
  password,
  phone: phone.trim()
});

    console.log('📦 Saving user to database...');
    await user.save();
    console.log('✅ User saved successfully. ID:', user._id);

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token created successfully');

    await user.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ REGISTRATION ERROR:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error', 
        error: error.message 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Duplicate key error', 
        error: 'Email already exists' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// ✅ Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password required' 
      });
    }

    // Find user
   const user = await User.findOne({ 
  email: email.toLowerCase().trim() 
});
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    console.log('✅ Login successful for:', email);

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// ✅ Get Current User
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Token error:', error.message);
    res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
});

// ✅ Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, no token' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User no longer exists' 
      });
    }
    
    req.user = decoded;
    req.userData = user;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ 
      success: false,
      message: 'Not authorized, token failed' 
    });
  }
};

module.exports = router;
module.exports.protect = protect;