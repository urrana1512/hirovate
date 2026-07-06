const QRCode = require('qrcode');

/**
 * Generates a Data URI containing a base64 encoded PNG of the QR Code
 * @param {string} data - The data to encode in the QR code
 * @returns {Promise<string>} - Base64 encoded image string
 */
const generateQRCode = async (data) => {
  try {
    const qrCodeImage = await QRCode.toDataURL(data, {
      color: {
        dark: '#2b5c8f', // Primary corporate blue
        light: '#ffffff'
      },
      width: 300,
      margin: 2
    });
    return qrCodeImage;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Could not generate QR code');
  }
};

module.exports = { generateQRCode };
