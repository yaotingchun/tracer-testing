const express = require('express');
const app = express();
app.use(express.json());

app.post('/orders', (req, res) => {
    const { user_id, items, total } = req.body;
    console.log(`Creating order for user ${user_id}`);
    res.status(201).json({ order_id: 101, status: 'pending', total });
});

app.listen(3003, () => console.log('Order service running on port 3003'));
