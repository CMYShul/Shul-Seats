const { GoogleSpreadsheet } = require('google-spreadsheet');
// NOTE: We have removed the vercel/postgres import

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        // We are ONLY logging to Google Sheets now.
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const newRow = req.body;
        await sheet.addRow(newRow);
        
        console.log('Successfully logged to Google Sheets. Failsafe is disabled.');
        res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.error('Error logging to Google Sheets:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};
