import React from 'react';

function ProductTemplate({ product }) {
    return (
        <div style={{ backgroundColor: 'red', padding: '10px' }}>
            <strong>{product.name}</strong>
            <p>Price: ${product.price}</p>
            <small>Product ID: {product.id}</small>
        </div>
    );
}

export default ProductTemplate;
