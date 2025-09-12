const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// This function is the main handler for the serverless function.
module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        // Initialize the authentication object
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Vercel needs this replacement
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // Initialize the Google Spreadsheet document
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

        await doc.loadInfo(); // Loads document properties and worksheets
        const sheet = doc.sheetsByIndex[0]; // Or use doc.sheetsByTitle['YourSheetName']

        // The data sent from the form
        const newRow = req.body;
        
        // Add the new row to the sheet
        await sheet.addRow(newRow);

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};