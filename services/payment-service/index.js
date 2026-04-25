const express = require('express');
const http = require('http');
const app = express();
app.use(express.json());

app.post('/payments/charge', (req, res) => {
    const { order_id, amount, discount_code, user_id } = req.body;
    
    // Fetch profile from user-service to calculate tax location
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
            let taxRate = 0.05; // Standard 5% default
            
            // George: Tax based on state string in address.
            // Risk: If user-service structure changes or address is missing, this could throw.
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
        res.status(500).json({ error: 'User-service call failed for tax calculation' });
    });
    userReq.end();
});

app.listen(3004, () => console.log('Payment service running on port 3004'));
