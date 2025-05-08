import qrcode from "qrcode";

/**
 * Creates a QR code as a data URL from the provided text
 * 
 * @param text The text or data to encode in the QR code
 * @returns A Promise that resolves to a data URL representing the QR code
 */
export async function createQRCode(text: string): Promise<string> {
  try {
    // Generate QR code with improved error correction and styling
    const dataUrl = await qrcode.toDataURL(text, {
      errorCorrectionLevel: 'H', // High error correction
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#FE2C55', // Primary color for the QR code
        light: '#FFFFFF' // White background
      },
      width: 300 // Larger size for better scanning
    });
    
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Validates a QR code data string
 * 
 * @param data The QR code data to validate
 * @returns An object with validation result and parsed data if valid
 */
export function validateQRCode(data: string): { valid: boolean; data?: any } {
  try {
    const parsedData = JSON.parse(data);
    
    // Basic validation checks
    if (!parsedData.type) {
      return { valid: false };
    }
    
    if (parsedData.type === 'event' && !parsedData.id) {
      return { valid: false };
    }
    
    if (parsedData.type === 'ticket' && (!parsedData.userId || !parsedData.eventId)) {
      return { valid: false };
    }
    
    return { valid: true, data: parsedData };
  } catch (error) {
    return { valid: false };
  }
}
