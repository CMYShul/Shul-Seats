// Seat type keys and prices (must match client data-price and field names)
const SEAT_PRICES = {
    RegularMen: 350,
    RegularBucherim: 200,
    KleiKodesh: 225,
    KleiKodeshBucherim: 130,
    Ladies: 250,
    Girls: 200,
    LadiesKleiKodesh: 175,
    GirlsKleiKodesh: 125,
};

const MAX_STRING_LENGTH = 500;
const MAX_SEATS_PER_TYPE = 100;

function parseNum(val, defaultVal = 0) {
    const n = parseInt(val, 10);
    return Number.isNaN(n) || n < 0 ? defaultVal : Math.min(n, MAX_SEATS_PER_TYPE);
}

function sanitizeString(val) {
    if (val == null) return '';
    let s = String(val).trim();
    if (s.length > MAX_STRING_LENGTH) {
        s = s.slice(0, MAX_STRING_LENGTH);
    }
    // Mitigate formula injection (CSV injection)
    if (['=', '+', '-', '@'].includes(s.charAt(0))) {
        s = "'" + s;
    }
    return s;
}

/** Validate and normalize body; returns { ok: true, data } or { ok: false, status, message }. */
function validateBody(body) {
    if (!body || typeof body !== 'object') {
        return { ok: false, status: 400, message: 'Invalid request body' };
    }

    let totalFromSeats = 0;
    const email = sanitizeString(body.Email);
    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, status: 400, message: 'Invalid email format' };
    }

    const row = {
        Timestamp: new Date().toISOString(),
        FirstName: sanitizeString(body.FirstName),
        LastName: sanitizeString(body.LastName),
        Email: email,
        Phone: sanitizeString(body.Phone),
        Comments: sanitizeString(body.Comments),
    };

    if (row.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email)) {
        return { ok: false, status: 400, message: 'Invalid email format' };
    }

    for (const [key, price] of Object.entries(SEAT_PRICES)) {
        const qty = parseNum(body[key], 0);
        row[key] = qty;
        totalFromSeats += qty * price;
    }

    const totalFromSeatsRounded = Math.round(totalFromSeats * 100) / 100;
    const clientTotal = parseFloat(body.Total);
    if (Number.isNaN(clientTotal) || clientTotal < 0 || Math.abs(clientTotal - totalFromSeatsRounded) > 0.02) {
        return { ok: false, status: 400, message: 'Total does not match selected seats' };
    }

    row.Total = totalFromSeatsRounded.toFixed(2);
    return { ok: true, data: row };
}

// Column order must match your sheet header row exactly (left to right)
const ROW_KEYS = [
    'Timestamp', 'FirstName', 'LastName',
    'RegularMen', 'RegularBucherim', 'KleiKodesh', 'KleiKodeshBucherim',
    'Ladies', 'Girls', 'LadiesKleiKodesh', 'GirlsKleiKodesh',
    'Paid', 'Comments', 'Total', 'Email', 'Phone'
];

function bodyToRowArray(body) {
    return ROW_KEYS.map((k) => body[k] ?? '');
}

module.exports = async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none';");

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    let parsedBody = req.body;
    if (typeof parsedBody === 'string') {
        try {
            parsedBody = JSON.parse(parsedBody);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid JSON body' });
        }
    }
    if (!parsedBody || typeof parsedBody !== 'object') {
        return res.status(400).json({ message: 'Missing or invalid request body' });
    }

    const validation = validateBody(parsedBody);
    if (!validation.ok) {
        return res.status(validation.status).json({ message: validation.message });
    }
    const body = validation.data;

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!sheetId || !serviceEmail || !privateKey) {
        console.error('Missing required Google Sheets env (GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY).');
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    const logToGoogleSheets = async () => {
        const { GoogleSpreadsheet } = await import('google-spreadsheet');
        const { JWT } = await import('google-auth-library');
        const serviceAccountAuth = new JWT({
            email: serviceEmail,
            key: privateKey.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        // Use array so we don't depend on sheet header names matching our keys
        await sheet.addRow(bodyToRowArray(body));
    };

    // --- Task 2: Web3Forms failsafe (email notification)
    // Note: Web3Forms recommends client-side use. Server-side requires paid plan + IP whitelisting.
    const logToFailsafe = async () => {
        if (!process.env.WEB3FORMS_ACCESS_KEY) {
            console.log('Web3Forms access key not configured. Skipping failsafe.');
            return;
        }

        const payload = {
            access_key: process.env.WEB3FORMS_ACCESS_KEY,
            subject: 'New Shul Seat Request',
            email: body.Email || '',
            from_name: [body.FirstName, body.LastName].filter(Boolean).join(' ') || 'Shul Seats',
            ...body,
        };

        try {
            const wRes = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const wData = await wRes.json().catch(() => ({}));
            if (!wRes.ok || wData.success === false) {
                console.warn('Web3Forms failsafe failed:', wRes.status, wData.message || wData);
            }
        } catch (e) {
            console.warn('Web3Forms request error:', e?.message || e);
        }
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
            const err = results[0].reason;
            console.error('CRITICAL: Google Sheets logging failed!', err);
            return res.status(500).json({
                message: 'Failed to record your request. Please try again.',
            });
        }

        res.status(200).json({ message: 'Submission processed' });

    } catch (error) {
        console.error('A fatal error occurred during the submission process:', error);
        return res.status(500).json({
            message: 'An unexpected error occurred.',
        });
    }
};
