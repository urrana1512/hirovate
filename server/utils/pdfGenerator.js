const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates an Admit Card PDF and returns a stream or buffer
 * @param {Object} data - Student and Slot data
 * @param {string} qrCodeDataURI - Base64 PNG string of the QR Code
 * @param {Object} res - Express response object to pipe the PDF to
 */
const generateAdmitCard = (data, qrCodeDataURI, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Pipe the PDF into the response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=AdmitCard_${data.studentId}.pdf`);
  doc.pipe(res);

  // Corporate Styling Header
  doc.rect(0, 0, doc.page.width, 100).fill('#2b5c8f');
  doc.fillColor('#ffffff')
     .fontSize(28)
     .font('Helvetica-Bold')
     .text('JOBFEST', 50, 35);
  doc.fontSize(12)
     .font('Helvetica')
     .text('Premium Corporate Placement Platform', 50, 65);

  // Admit Card Title
  doc.fillColor('#1e4266')
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('INTERVIEW ADMIT CARD', 50, 130, { align: 'center' });
  doc.moveDown(2);

  // Company Details section
  doc.fillColor('#2d3748').fontSize(14).font('Helvetica-Bold').text('Interview Details');
  doc.rect(50, doc.y + 5, doc.page.width - 100, 1).fill('#e2e8f0');
  doc.moveDown(1);
  
  doc.fillColor('#4a5568').fontSize(12).font('Helvetica');
  doc.text(`Company: ${data.companyName}`);
  doc.text(`Role: ${data.role}`);
  doc.text(`Date: ${data.date}`);
  doc.text(`Time: ${data.startTime} - ${data.endTime}`);
  doc.text(`Venue: ${data.venue}`);
  doc.moveDown(2);

  // Student Details section
  doc.fillColor('#2d3748').fontSize(14).font('Helvetica-Bold').text('Candidate Information');
  doc.rect(50, doc.y + 5, doc.page.width - 100, 1).fill('#e2e8f0');
  doc.moveDown(1);

  doc.fillColor('#4a5568').fontSize(12).font('Helvetica');
  doc.text(`Name: ${data.studentName}`);
  doc.text(`Student ID: ${data.studentId}`);
  doc.text(`University: ${data.university}`);
  doc.moveDown(3);

  // Insert QR Code (Converting Base64 Data URI to Buffer)
  if (qrCodeDataURI) {
    const base64Data = qrCodeDataURI.replace(/^data:image\/png;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, 'base64');
    
    doc.image(imgBuffer, (doc.page.width - 150) / 2, doc.y, { width: 150 });
    doc.moveDown(1);
    doc.fillColor('#718096').fontSize(10).text('Scan QR Code for Attendance Verification', { align: 'center' });
  }

  // Footer Instructions
  doc.moveDown(4);
  doc.fillColor('#e53e3e').fontSize(10).font('Helvetica-Bold').text('Important Instructions:');
  doc.fillColor('#718096').font('Helvetica');
  doc.text('1. Please carry a printed copy of this admit card.');
  doc.text('2. Bring 2 copies of your updated resume.');
  doc.text('3. Arrive 30 minutes before the scheduled time.');

  doc.end();
};

module.exports = { generateAdmitCard };
