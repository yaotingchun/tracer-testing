import React, { useState } from 'react';

export default function CheckoutPage({ cartItems, total }) {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [discountCode, setDiscountCode] = useState('');

    const handleCheckout = () => {
        fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_id: 1, 
                items: cartItems,
                total: total,
                discount_code: discountCode
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
            <div style={{ margin: '10px 0' }}>
                <input 
                    type="text" 
                    placeholder="Discount Code" 
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)} 
                />
            </div>
            <button onClick={handleCheckout}>Pay & Place Order</button>
            {paymentStatus && <p>{paymentStatus}</p>}
        </div>
    );
}
