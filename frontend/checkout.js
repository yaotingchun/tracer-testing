import React, { useState } from 'react';

export default function CheckoutPage({ cartItems, total }) {
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handleCheckout = () => {
        fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 1, // Prototype hardcoded ID
                items: cartItems,
                total: total
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'paid') {
                setPaymentStatus('Order placed successfully!');
            } else {
                setPaymentStatus('Payment failed. Try again.');
            }
        });
    };

    return (
        <div className="checkout-container" style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Checkout</h2>
            <div>Total amount: ${total}</div>
            <button onClick={handleCheckout}>Pay & Place Order</button>
            {paymentStatus && <p>{paymentStatus}</p>}
        </div>
    );
}
