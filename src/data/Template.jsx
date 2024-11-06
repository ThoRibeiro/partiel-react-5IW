import React from 'react';

function ProductTemplate({ product }) {
    return (
        <div style={{ backgroundColor: 'red', padding: '10px' }}>
            <strong>{product.name}</strong>
            <p>Prix: {product.price}€</p>
        </div>
    );
}

export default ProductTemplate;
