const { GoogleSpreadsheet } = require('google-spreadsheet');
const { sql } = require('@vercel/postgres'); // <-- Import the Vercel Postgres SDK

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    // --- Task 1: Log to Google Sheets (remains the same) ---
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

    // --- Task 2: Log to Vercel Postgres Failsafe ---
    const logToPostgres = async () => {
        const {
            FirstName, LastName, Email, Phone, Comments,
            RegularMen, RegularBucherim, KleiKodesh, KleiKodeshBucherim,
            Ladies, Girls, LadiesKleiKodesh, GirlsKleiKodesh, Total
        } = req.body;

        // Use the 'sql' template literal to safely insert data
        await sql`
            INSERT INTO submissions (
                firstName, lastName, email, phone, comments,
                regularMen, regularBucherim, kleiKodesh, kleiKodeshBucherim,
                ladies, girls, ladiesKleiKodesh, girlsKleiKodesh, total
            ) VALUES (
                ${FirstName}, ${LastName}, ${Email}, ${Phone}, ${Comments},
                ${RegularMen}, ${RegularBucherim}, ${KleiKodesh}, ${KleiKodeshBucherim},
                ${Ladies}, ${Girls}, ${LadiesKleiKodesh}, ${GirlsKleiKodesh}, ${Total}
            );
        `;
    };

    // --- Main Logic: Try both logging tasks ---
    try {
        const results = await Promise.allSettled([
            logToGoogleSheets(),
            logToPostgres()
        ]);

        console.log('Logging Task Status:', {
            googleSheets: results[0].status,
            vercelPostgres: results[1].status,
        });

        if (results[0].status === 'rejected') {
            console.error('CRITICAL: Google Sheets logging failed!', results[0].reason);
        }
        if (results[1].status === 'rejected') {
            console.error('CRITICAL: Vercel Postgres logging failed!', results[1].reason);
        }

        res.status(200).json({ message: 'Submission processed' });
    } catch (error) {
        console.error('A fatal error occurred during the submission process:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};
