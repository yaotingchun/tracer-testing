const express = require('express');
const http = require('http');
const { getProfileData } = require('./profile-helper');
const app = express();
app.use(express.json());

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const authReq = http.request({
        hostname: 'localhost',
        port: 3001,
        path: '/auth/verify',
        method: 'POST',
        headers: { 'Authorization': authHeader }
    }, (authRes) => {
        if (authRes.statusCode === 200) {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized token' });
        }
    });
    authReq.on('error', () => res.status(500).json({ error: 'Auth service down' }));
    authReq.end();
};

app.get('/users/:id/profile', verifyToken, (req, res) => {
    // Now calls profile-helper
    const profile = getProfileData(req.params.id);
    res.json(profile);
});

app.get('/users/:id/loyalty', verifyToken, (req, res) => {
    res.json({
        customer_id: req.params.id,
        points: 150
    });
});

app.listen(3002, () => console.log('User service running on port 3002'));
