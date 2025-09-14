const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    // --- Task 1: A function to handle logging to Google Sheets ---
    const logToGoogleSheets = async () => {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

        // Authenticate with the service account
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });

        // Load the document properties and worksheets
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        // Add the form data as a new row
        await sheet.addRow(req.body);
    };

    // --- Task 2: A function to handle logging to the Formspree failsafe ---
    const logToFailsafe = async () => {
        // First, check if the FORMSPREE_ENDPOINT is configured in Vercel
        if (!process.env.FORMSPREE_ENDPOINT) {
            console.log('Formspree endpoint not configured. Skipping failsafe.');
            return; // Exit the function if there's no endpoint
        }

        // Send the form data to Formspree
        await fetch(process.env.FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(req.body),
        });
    };


    // --- Main Logic: Try both logging tasks ---
    try {
        // Promise.allSettled is perfect for a failsafe. It runs all tasks
        // and tells you which ones succeeded or failed, without stopping if one fails.
        const results = await Promise.allSettled([
            logToGoogleSheets(),
            logToFailsafe()
        ]);

        // For your debugging: You can see the outcome of both tasks in the Vercel logs
        console.log('Logging Task Status:', {
            googleSheets: results[0].status,
            formspreeFailsafe: results[1].status,
        });

        // If the primary method (Google Sheets) failed, log the specific error
        if (results[0].status === 'rejected') {
            console.error('CRITICAL: Google Sheets logging failed!', results[0].reason);
        }

        // IMPORTANT: We send a "Success" response back to the user's browser
        // even if one of the logging methods failed. This allows them to proceed to payment.
        res.status(200).json({ message: 'Submission processed' });

    } catch (error) {
        // This outer catch block will only run if there's a truly unexpected error.
        console.error('A fatal error occurred during the submission process:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};
