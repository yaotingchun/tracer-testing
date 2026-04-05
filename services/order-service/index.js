const express = require('express');
const http = require('http');
const app = express();
app.use(express.json());

app.post('/orders', (req, res) => {
    const { user_id, items, total } = req.body;
    console.log(`Creating order for user ${user_id}`);

    // Call payment-service to charge the total amount
    const paymentPayload = JSON.stringify({ order_id: 101, amount: total });
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
        res.status(500).json({ error: 'Payment service unreachable', details: err.message });
    });

    payReq.write(paymentPayload);
    payReq.end();
});

app.listen(3003, () => console.log('Order service running on port 3003'));
