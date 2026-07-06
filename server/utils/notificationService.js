const nodemailer = require('nodemailer');

// Mock implementation of SMS and Email services to prevent crash without actual credentials
const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your_email@gmail.com') {
      console.log(`[Mock Email] To: ${options.email}, Subject: ${options.subject}`);
      console.log(`[Mock Email] Message: ${options.message}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Hirovate <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendSMS = async (options) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_ACCOUNT_SID === 'your_twilio_sid') {
      console.log(`[Mock SMS] To: ${options.phone}`);
      console.log(`[Mock SMS] Message: ${options.message}`);
      return;
    }

    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: options.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: options.phone
    });
    console.log('SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

module.exports = { sendEmail, sendSMS };
