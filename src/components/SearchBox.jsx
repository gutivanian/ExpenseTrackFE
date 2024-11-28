import React, { useState } from 'react';

const SearchBox = ({ searchTerm, onSearchChange, products, onSelectProduct }) => {
    const [activeIndex, setActiveIndex] = useState(null); // Track active item for styling

    return (
        <div>
            <h6>Search Product</h6>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <ul className="list-group">
                {products.map((product, index) => (
                    <li
                        key={product.id}
                        className={`list-group-item ${
                            activeIndex === index ? 'active' : ''
                        }`}
                        onClick={() => {
                            onSelectProduct(product);
                            setActiveIndex(index); // Set active item on click
                        }}
                        onMouseEnter={() => setActiveIndex(index)} // Highlight on hover
                        onMouseLeave={() => setActiveIndex(null)} // Remove highlight when not hovering
                        style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
                    >
                        {product.nama_produk} - {product.toko}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBox;
