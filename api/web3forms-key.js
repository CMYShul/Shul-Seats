// Returns Web3Forms access key for client-side submit (avoids server-side IP whitelisting).
module.exports = (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const key = process.env.WEB3FORMS_ACCESS_KEY || '';
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    return res.status(200).json({ access_key: key ? key : '' });
};
