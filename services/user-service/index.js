const express = require('express');
const app = express();
app.use(express.json());

app.get('/users/:id/profile', (req, res) => {
    res.json({
        user_id: req.params.id,
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St, New York, NY 10001'
    });
});

app.listen(3002, () => console.log('User service running on port 3002'));
