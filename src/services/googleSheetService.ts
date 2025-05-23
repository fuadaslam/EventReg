import { UserRegistrationData } from '../context/AppContext';

// Replace this URL with your Google Apps Script web app URL after deployment
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxm8oBSMqbN8vNTmX5fcsb9MkW-9YzNctL-jmJxycULcNGyh11AanUpccu20Ard50WZ/exec';

export const saveToGoogleSheet = async (data: UserRegistrationData & { 
  badgeTemplate: string;
  photoUploaded: boolean;
}): Promise<boolean> => {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(data),
    });

    // Since we're using no-cors, we can't check response.ok
    // Instead, we'll assume success if no error is thrown
    return true;
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    // Store in localStorage as fallback
    try {
      const pendingRegistrations = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
      pendingRegistrations.push({
        ...data,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      localStorage.setItem('pendingRegistrations', JSON.stringify(pendingRegistrations));
    } catch (storageError) {
      console.error('Failed to store registration in localStorage:', storageError);
    }
    return false;
  }
};

/**
 * In a real implementation, you would use a serverless function or backend API:
 * 
 * Example using Google Sheets API directly (requires backend with proper auth):
 * 
 * async function appendToSheet(data) {
 *   // This would be in a serverless function or backend
 *   const { GoogleSpreadsheet } = require('google-spreadsheet');
 *   
 *   // Initialize the sheet
 *   const doc = new GoogleSpreadsheet(SHEET_ID);
 *   await doc.useServiceAccountAuth({
 *     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
 *     private_key: process.env.GOOGLE_PRIVATE_KEY,
 *   });
 *   
 *   await doc.loadInfo();
 *   const sheet = doc.sheetsByIndex[0];
 *   
 *   // Append a row
 *   await sheet.addRow({
 *     name: data.name,
 *     email: data.email,
 *     phone: data.phone,
 *     // ... other fields
 *     timestamp: new Date().toISOString()
 *   });
 *   
 *   return true;
 * }
 */