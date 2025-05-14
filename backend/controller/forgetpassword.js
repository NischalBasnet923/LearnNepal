const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer.js');
const validator = require('validator');

const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: hashedOTP },
    });

    res.status(200).json({ message: 'OTP sent to email' });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      text: `Your verification code is ${otp}. This code will expire in 6 minutes.`,
      html: `<p>Your verification code is <strong>${otp}</strong>. This code will expire in 6 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    // Clear the OTP after 6 minutes
    setTimeout(async () => {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { otp: null },
        });
      } catch (error) {
        console.error('Error clearing OTP:', error.message);
      }
    }, 360000);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(req.body);
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isOTPValid = await bcrypt.compare(otp, user.otp);
    if (!isOTPValid) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null },
    });
    res.status(200).json({ message: 'OTP verified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password is not strong' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestOTP,
  verifyOTP,
  resetPassword,
};
