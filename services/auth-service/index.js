const express = require('express');
const app = express();
app.use(express.json());

// In-memory token store for sessions
const sessions = {};

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const token = `mock-token-for-${email}`;
        sessions[token] = { email };
        return res.json({ token });
    }
    return res.status(400).json({ error: 'Invalid credentials' });
});

app.post('/auth/verify', (req, res) => {
    const token = req.headers['authorization'];
    if (sessions[token]) {
        return res.json({ valid: true, user: sessions[token] });
    }
    return res.status(401).json({ valid: false });
});

app.listen(3001, () => console.log('Auth service running on port 3001'));
