const { GoogleSpreadsheet } = require('google-spreadsheet');

// NOTE: We no longer need to import { JWT } from 'google-auth-library'
// The google-spreadsheet library v3.3.0 handles this for us.

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        // Initialize the Google Spreadsheet document
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

        // --- THIS BLOCK IS THE FIX ---
        // We now use the `useServiceAccountAuth` method to authenticate.
        // This is the correct syntax for google-spreadsheet v3.3.0.
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            // The private_key needs the .replace() for Vercel's environment variables
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        // --- END OF FIX ---

        await doc.loadInfo(); // This will now work because auth is initialized.
        const sheet = doc.sheetsByIndex[0]; // Or use doc.sheetsByTitle['YourSheetName']

        const newRow = req.body;
        
        await sheet.addRow(newRow);

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};