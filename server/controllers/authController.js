const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const jwt = require('jsonwebtoken');
const { sendEmail, sendSMS } = require('../utils/notificationService');
const crypto = require('crypto');

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper to generate a 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOTP();
    // Hash OTP before saving
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'student',
      status: 'pending', // Explicitly set to pending
      verifyOtp: hashedOtp,
      verifyOtpExpire: otpExpire,
    });

    // Send OTP
    const message = `Your JobFest verification code is: ${otp}. It is valid for 10 minutes.`;
    console.log(`\n📨 [Registration OTP] User: ${user.email} | OTP: ${otp}\n`);
    await sendEmail({ email: user.email, subject: 'JobFest - Verify your account', message });
    await sendSMS({ phone: user.phone, message });

    res.status(201).json({
      success: true,
      message: 'OTP sent to email and phone. Please verify to continue registration.',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (user.verifyOtp !== hashedOtp || user.verifyOtpExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpire = undefined;
    // Status remains 'pending' until Admin approves
    await user.save();

    // Create corresponding profile after verification
    if (user.role === 'student') {
      await StudentProfile.create({ user: user._id });
    } else if (user.role === 'company') {
      await CompanyProfile.create({ user: user._id, companyName: user.name });
    }

    res.status(200).json({
      success: true,
      message: 'Account verified successfully. Please wait for Admin approval to login.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Bypass status check for admins
    if (user.role !== 'admin') {
      if (!user.isVerified) {
        return res.status(403).json({ message: 'Account not verified via OTP. Please verify your account.' });
      }
      if (user.status === 'pending') {
        return res.status(403).json({ message: 'Account is waiting for Admin approval. Please try again later.' });
      }
      if (user.status === 'rejected') {
        return res.status(403).json({ message: 'Account has been rejected by Admin.' });
      }
      if (user.status === 'blocked') {
        return res.status(403).json({ message: 'Account has been blocked. Contact support.' });
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    const otp = generateOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const message = `Your JobFest password reset OTP is: ${otp}. It is valid for 10 minutes.`;
    console.log(`\n🔑 [Password Reset OTP] User: ${user.email} | OTP: ${otp}\n`);
    await sendEmail({ email: user.email, subject: 'JobFest - Password Reset', message });

    res.status(200).json({ success: true, message: 'Password reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (user.resetPasswordOtp !== hashedOtp || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
