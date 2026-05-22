// Returns Web3Forms access key for client-side submit (avoids server-side IP whitelisting).
module.exports = (req, res) => {
    // Standard security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none';");
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const key = process.env.WEB3FORMS_ACCESS_KEY || '';
    return res.status(200).json({ access_key: key ? key : '' });
};
