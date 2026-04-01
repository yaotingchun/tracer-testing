const express = require('express');
const app = express();
app.use(express.json());

app.post('/payments/charge', (req, res) => {
    const { order_id, amount } = req.body;
    console.log(`Charging payment for order ${order_id} of amount ${amount}`);
    res.json({ transaction_id: 'tx_abc123', status: 'success' });
});

app.listen(3004, () => console.log('Payment service running on port 3004'));
