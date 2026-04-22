const express = require('express');
const app = express();
app.use(express.json());

app.post('/payments/charge', (req, res) => {
    const { order_id, amount, discount_code } = req.body;
    
    let finalAmount = amount;
    // Charlie: Added guard against null/undefined discount_code
    if (discount_code && discount_code.toUpperCase() === 'SPRING20') {
        finalAmount = amount * 0.8;
        console.log(`Applying 20% discount. Final charge: ${finalAmount}`);
    }

    console.log(`Charging payment for order ${order_id} of amount ${finalAmount}`);
    res.json({ transaction_id: 'tx_abc123', status: 'success', charged_amount: finalAmount });
});

app.listen(3004, () => console.log('Payment service running on port 3004'));
