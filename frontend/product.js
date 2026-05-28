import React, { useState, useEffect } from 'react';

export default function ProductPage({ productId }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [promo, setPromo] = useState('');

    useEffect(() => {
        fetch(`/api/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            });

        // Bob: Consuming corrected flat campaigns array safely
        fetch('/api/payments/promo-campaigns')
            .then(res => res.json())
            .then(data => {
                if (data.campaigns && data.campaigns.length > 0) {
                    setPromo(data.campaigns[0].bannerText);
                }
            })
            .catch(e => console.error('Failed to load promotions', e));
    }, [productId]);

    if (loading) return <div>Loading product...</div>;

    return (
        <div className="product-container" style={{ padding: '20px', fontFamily: 'Arial' }}>
            {promo && <div className="promo-banner" style={{ background: '#ffeb3b', padding: '10px' }}>{promo}</div>}
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <span className="price">${product.price}</span>
            <button onClick={() => window.location.href = `/checkout?product=${productId}`}>
                Buy Now
            </button>
        </div>
    );
}
