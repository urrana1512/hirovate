const { generateQRCode } = require('../utils/qrGenerator');
const { generateAdmitCard } = require('../utils/pdfGenerator');
const { sendEmail, sendSMS } = require('../utils/notificationService');

// @desc    Download Admit Card for a specific application
// @route   GET /api/features/admit-card/:applicationId
// @access  Private
exports.downloadAdmitCard = async (req, res) => {
  try {
    // In a real application, you would fetch this data from the DB using req.params.applicationId
    // and populate the Student, Slot, and Company models. 
    // We mock the data here to demonstrate the feature logic.
    const mockData = {
      studentId: 'STU9921',
      studentName: req.user ? req.user.name : 'Test Student',
      university: 'Global Tech University',
      companyName: 'TechCorp Inc.',
      role: 'Software Engineer',
      date: 'May 25, 2024',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      venue: 'Main Campus, Building B, Room 402'
    };

    // Generate QR Code containing a mock verification string
    const verificationString = JSON.stringify({ appId: req.params.applicationId, student: mockData.studentId });
    const qrCodeDataURI = await generateQRCode(verificationString);

    // Generate PDF and pipe to response
    generateAdmitCard(mockData, qrCodeDataURI, res);

  } catch (error) {
    console.error('Admit card error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating admit card' });
    }
  }
};

// @desc    Trigger notification
// @route   POST /api/features/notify
// @access  Private (Admin only usually)
exports.triggerNotification = async (req, res) => {
  try {
    const { email, phone, message, subject } = req.body;

    if (email) {
      await sendEmail({ email, subject: subject || 'Hirovate Notification', message });
    }
    if (phone) {
      await sendSMS({ phone, message });
    }

    res.status(200).json({ success: true, message: 'Notification(s) triggered' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending notifications' });
  }
};
