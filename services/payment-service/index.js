const express = require('express');
const http = require('http');
const app = express();
app.use(express.json());

app.get('/payments/promo-campaigns', (req, res) => {
    res.json({
        campaigns: [
            { id: "spring_rush", discountPercent: 15, bannerText: "Spring is here! 15% off" }
        ]
    });
});

app.post('/payments/charge', (req, res) => {
    const { order_id, amount, discount_code } = req.body;
    
    // Diana: Validate authorization header and extract customer identity securely.
    // Avoids trusting the client-supplied user_id body parameter.
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Missing security verification' });

    const authReq = http.request({
        hostname: 'localhost',
        port: 3001,
        path: '/auth/verify',
        method: 'POST',
        headers: { 'Authorization': authHeader }
    }, (authRes) => {
        let authData = '';
        authRes.on('data', chunk => authData += chunk);
        authRes.on('end', () => {
            const authResult = JSON.parse(authData);
            if (!authResult.valid) return res.status(401).json({ error: 'Unauthorized payment session' });
            
            // Assuming email resolves to matching customer ID structure
            const resolvedCustomerId = 1; // Simulated resolution
            
            // Query details from user service
            const userReq = http.request({
                hostname: 'localhost',
                port: 3002,
                path: `/users/${resolvedCustomerId}/profile`,
                method: 'GET',
                headers: { 'Authorization': authHeader }
            }, (userRes) => {
                let data = '';
                userRes.on('data', chunk => data += chunk);
                userRes.on('end', () => {
                    const profile = JSON.parse(data);
                    let taxRate = 0.05;
                    
                    if (profile.address && profile.address.includes('NY')) {
                        taxRate = 0.08;
                    }
                    
                    let tierDiscountMultiplier = 1.0;
                    if (profile.tier === 'gold') {
                        tierDiscountMultiplier = 0.9;
                    } else if (profile.tier === 'silver') {
                        tierDiscountMultiplier = 0.95;
                    }
                    
                    let finalAmount = (amount * tierDiscountMultiplier) * (1 + taxRate);
                    if (discount_code && discount_code.toUpperCase() === 'SPRING20') {
                        finalAmount = ((amount * 0.8) * tierDiscountMultiplier) * (1 + taxRate);
                    }

                    console.log(`Charging payment for order ${order_id}. Authenticated client: ${authResult.email}`);
                    res.json({ transaction_id: 'tx_abc123', status: 'success', charged_amount: finalAmount });
                });
            });
            userReq.end();
        });
    });
    authReq.end();
});

app.listen(3004, () => console.log('Payment service running on port 3004'));
