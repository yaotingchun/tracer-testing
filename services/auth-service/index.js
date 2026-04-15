const express = require('express');
const app = express();
app.use(express.json());

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        // Base64 signed token with 1 hour expiration
        const token = Buffer.from(JSON.stringify({ email, role: 'user', exp: Date.now() + 3600000 }))
            .toString('base64');
        return res.json({ token });
    }
    return res.status(400).json({ error: 'Invalid credentials' });
});

app.post('/auth/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Missing token' });

    try {
        const token = authHeader.split(' ')[1];
        const payload = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
        if (payload.exp > Date.now()) {
            return res.json({ valid: true, email: payload.email, role: payload.role });
        }
        return res.status(401).json({ valid: false, error: 'Token expired' });
    } catch (e) {
        return res.status(401).json({ valid: false, error: 'Invalid token' });
    }
});

app.listen(3001, () => console.log('Auth service running on port 3001'));
