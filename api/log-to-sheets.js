const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    // --- Task 1: A function to handle logging to Google Sheets ---
    const logToGoogleSheets = async () => {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        await sheet.addRow(req.body);
    };

    // --- Task 2: A function to handle logging to the Web3Forms failsafe ---
    const logToFailsafe = async () => {
        // Check if the WEB3FORMS_ACCESS_KEY is configured in Vercel
        if (!process.env.WEB3FORMS_ACCESS_KEY) {
            console.log('Web3Forms access key not configured. Skipping failsafe.');
            return;
        }

        // The data needs to include the access key for Web3Forms
        const payload = {
            ...req.body, // Include all the original form data
            access_key: process.env.WEB3FORMS_ACCESS_KEY,
            subject: 'New Shul Seat Request', // Optional: customize the email subject
        };

        // Send the data to Web3Forms
        await fetch("https://api.web3forms.com/submit", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    };


    // --- Main Logic: Try both logging tasks ---
    try {
        const results = await Promise.allSettled([
            logToGoogleSheets(),
            logToFailsafe()
        ]);

        console.log('Logging Task Status:', {
            googleSheets: results[0].status,
            web3formsFailsafe: results[1].status,
        });

        if (results[0].status === 'rejected') {
            console.error('CRITICAL: Google Sheets logging failed!', results[0].reason);
        }

        res.status(200).json({ message: 'Submission processed' });

    } catch (error) {
        console.error('A fatal error occurred during the submission process:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};
