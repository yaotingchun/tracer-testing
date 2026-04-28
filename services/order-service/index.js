const express = require('express');
const http = require('http');
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

app.post('/orders', verifyToken, (req, res) => {
    // Fiona: Updated user_id to customer_id inside the body
    const { customer_id, items, total } = req.body;
    console.log(`Creating order for customer ${customer_id}`);

    // Call payment service with customer_id instead of user_id
    const paymentPayload = JSON.stringify({ order_id: 101, amount: total, user_id: customer_id });
    const payReq = http.request({
        hostname: 'localhost',
        port: 3004,
        path: '/payments/charge',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': paymentPayload.length
        }
    }, (payRes) => {
        let data = '';
        payRes.on('data', chunk => data += chunk);
        payRes.on('end', () => {
            const paymentResult = JSON.parse(data);
            if (paymentResult.status === 'success') {
                res.status(201).json({ order_id: 101, status: 'paid', transaction_id: paymentResult.transaction_id });
            } else {
                res.status(400).json({ error: 'Payment failed' });
            }
        });
    });

    payReq.on('error', (err) => {
        res.status(500).json({ error: 'Payment service unreachable' });
    });

    payReq.write(paymentPayload);
    payReq.end();
});

app.listen(3003, () => console.log('Order service running on port 3003'));
