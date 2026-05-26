const express = require('express');
const http = require('http');
const app = express();
app.use(express.json());

// Charlie: Stabilized active_promos response schema. Always returns flat list array of campaigns.
app.get('/payments/promo-campaigns', (req, res) => {
    res.json({
        campaigns: [
            { id: "spring_rush", discountPercent: 15, bannerText: "Spring is here! 15% off" }
        ]
    });
});

app.post('/payments/charge', (req, res) => {
    const { order_id, amount, discount_code, user_id } = req.body;
    
    const userReq = http.request({
        hostname: 'localhost',
        port: 3002,
        path: `/users/${user_id}/profile`,
        method: 'GET'
    }, (userRes) => {
        let data = '';
        userRes.on('data', chunk => data += chunk);
        userRes.on('end', () => {
            const profile = JSON.parse(data);
            let taxRate = 0.05;
            
            if (profile.address && profile.address.includes('NY')) {
                taxRate = 0.08;
            }
            
            let finalAmount = amount * (1 + taxRate);
            if (discount_code && discount_code.toUpperCase() === 'SPRING20') {
                finalAmount = (amount * 0.8) * (1 + taxRate);
            }

            console.log(`Charging payment for order ${order_id} with tax ${taxRate}. Total: ${finalAmount}`);
            res.json({ transaction_id: 'tx_abc123', status: 'success', charged_amount: finalAmount });
        });
    });
    userReq.on('error', () => {
        res.status(500).json({ error: 'User-service call failed' });
    });
    userReq.end();
});

app.listen(3004, () => console.log('Payment service running on port 3004'));
