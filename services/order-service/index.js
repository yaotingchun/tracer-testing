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
    const { customer_id, items, total, shipping_speed, shipping_zip } = req.body;
    console.log(`Creating order for customer ${customer_id}`);

    // Charlie: Fixed shipping calculation crash by checking zip validity and country structures
    let shippingCharge = 0;
    if (shipping_speed === 'expedited') {
        if (shipping_zip && typeof shipping_zip === 'string') {
            const match = shipping_zip.match(/^\d{5}$/);
            if (match) {
                shippingCharge = 15.00;
            } else {
                shippingCharge = 35.00; // International standard expedited
            }
        } else {
            shippingCharge = 25.00;
        }
    }

    const finalTotal = total + shippingCharge;
    const paymentPayload = JSON.stringify({ order_id: 101, amount: finalTotal });
    const payReq = http.request({
        hostname: 'localhost',
        port: 3004,
        path: '/payments/charge',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': paymentPayload.length,
            'Authorization': req.headers['authorization']
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
