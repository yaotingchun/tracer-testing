import React, { useState, useEffect } from 'react';

export default function ProductPage({ productId }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            });
    }, [productId]);

    if (loading) return <div>Loading product...</div>;

    return (
        <div className="product-container" style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <span className="price">${product.price}</span>
            <button onClick={() => window.location.href = `/checkout?product=${productId}`}>
                Buy Now
            </button>
        </div>
    );
}
