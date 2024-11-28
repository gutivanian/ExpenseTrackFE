import React, { useState } from 'react';
import axios from 'axios';

const ProductSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [manualProduct, setManualProduct] = useState(false); // State untuk modal
    const [transactionBoxVisible, setTransactionBoxVisible] = useState(true); // State untuk minimize/maximize
    const [productDetails, setProductDetails] = useState({
        nama_produk: '',
        toko: '',
        kategori: '',
        subkategori: '',
        harga: '',
        date: '',
        quantity: 1,
        pajak: 0,
    });
    

    const handleSearchChange = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            try {
                const response = await axios.get(`/api/products?search=${term}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
                setProducts([]);
            }
        } else {
            setProducts([]);
        }
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setProductDetails({
            nama_produk: product.nama_produk,
            toko: product.toko,
            kategori: product.kategori,
            subkategori: product.subkategori,
            harga: product.harga,
            date: new Date().toISOString().slice(0, 10),
            quantity: 1,
            pajak: 0,
        });
        setSearchTerm(''); // Mengosongkan search bar
        setProducts([]); // Mengosongkan dropdown hasil pencarian
    };

    const handleManualInput = () => {
        setManualProduct(!manualProduct);
        setProductDetails({
            nama_produk: '',
            toko: '',
            kategori: '',
            subkategori: '',
            harga: '',
            date: '',
            quantity: 1,
            pajak: 0,
        });
        setSelectedProduct(null);
    };

    const handleSaveProduct = async () => {
        try {
            const newProduct = await axios.post('/api/products', {
                ...productDetails,
            });
            setSelectedProduct(newProduct.data);
            alert('Product saved!');
            setManualProduct(false);
        } catch (error) {
            console.error('Error saving product', error);
            alert('Failed to save product');
        }
    };

    const handleSaveExpense = async () => {
        try {
            await axios.post('/api/expenses', {
                product_id: selectedProduct.id,
                ...productDetails,
                total_harga: productDetails.harga * productDetails.quantity,
                total_harga_tax: productDetails.harga * productDetails.quantity * (1 + productDetails.pajak / 100),
            });
            alert('Expense saved!');
        } catch (error) {
            console.error('Error saving expense', error);
            alert('Failed to save expense');
        }
    };

    return (
        <div className="container mt-3">
            {/* Manual Input Modal */}
            {manualProduct && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Input Product Manually</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setManualProduct(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <label>Nama Produk:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={productDetails.nama_produk}
                                    onChange={(e) =>
                                        setProductDetails({ ...productDetails, nama_produk: e.target.value })
                                    }
                                />
                                <label>Toko:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={productDetails.toko}
                                    onChange={(e) =>
                                        setProductDetails({ ...productDetails, toko: e.target.value })
                                    }
                                />
                                <label>Kategori:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={productDetails.kategori}
                                    onChange={(e) =>
                                        setProductDetails({ ...productDetails, kategori: e.target.value })
                                    }
                                />
                                <label>Subkategori:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={productDetails.subkategori}
                                    onChange={(e) =>
                                        setProductDetails({ ...productDetails, subkategori: e.target.value })
                                    }
                                />
                                <label>Harga:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={productDetails.harga}
                                    onChange={(e) =>
                                        setProductDetails({ ...productDetails, harga: e.target.value })
                                    }
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setManualProduct(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveProduct}
                                >
                                    Save Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Box with Search */}
            <div className="card shadow-sm p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Proses Transaksi</h5>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setTransactionBoxVisible(!transactionBoxVisible)}
                    >
                        {transactionBoxVisible ? 'Minimize' : 'Maximize'}
                    </button>
                </div>
                {transactionBoxVisible && (
                    <div>
                        {/* Button for Manual Input */}
                        <button className="btn btn-link mt-2" onClick={handleManualInput}>
                            {manualProduct ? 'Back to Search' : 'Product Not Found? Add Manually'}
                        </button>

                        {/* Search Box */}
                        <div className="mb-4">
                            <h6>Search Product</h6>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Search Product..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <ul className="list-group">
                                {products.map((product) => (
                                    <li
                                        key={product.id}
                                        className="list-group-item"
                                        onClick={() => handleProductSelect(product)}
                                    >
                                        {product.nama_produk} - {product.toko}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Transaction Details */}
                        {selectedProduct && (
                            <div>
                                <h6>Nama Produk: {selectedProduct.nama_produk}</h6>
                                <p>Toko: {selectedProduct.toko}</p>
                                <p>Kategori: {selectedProduct.kategori}</p>
                                <p>Subkategori: {selectedProduct.subkategori}</p>
                                <p>
                                    Harga:
                                    <input
                                        type="number"
                                        className="form-control d-inline w-50"
                                        value={productDetails.harga}
                                        onChange={(e) =>
                                            setProductDetails({ ...productDetails, harga: e.target.value })
                                        }
                                    />
                                </p>
                                <p>
                                    Quantity:
                                    <input
                                        type="number"
                                        className="form-control d-inline w-50"
                                        value={productDetails.quantity}
                                        onChange={(e) =>
                                            setProductDetails({
                                                ...productDetails,
                                                quantity: e.target.value,
                                                total_harga: e.target.value * productDetails.harga,
                                            })
                                        }
                                    />
                                </p>
                                <p>
                                    Total Harga:
                                    <input
                                        type="number"
                                        className="form-control d-inline w-50"
                                        value={productDetails.total_harga}
                                        readOnly
                                    />
                                </p>
                                <p>
                                    Tax (%):
                                    <input
                                        type="number"
                                        className="form-control d-inline w-25"
                                        value={productDetails.pajak}
                                        onChange={(e) =>
                                            setProductDetails({
                                                ...productDetails,
                                                pajak: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="btn btn-secondary ms-2"
                                        onClick={() =>
                                            setProductDetails({
                                                ...productDetails,
                                                pajak:
                                                    ((productDetails.total_harga_tax -
                                                        productDetails.total_harga) /
                                                        productDetails.total_harga) *
                                                    100,
                                            })
                                        }
                                    >
                                        Isi Otomatis
                                    </button>
                                </p>
                                <p>
                                    Total Harga + Tax:
                                    <input
                                        type="number"
                                        className="form-control d-inline w-50"
                                        value={productDetails.total_harga_tax}
                                        onChange={(e) =>
                                            setProductDetails({
                                                ...productDetails,
                                                total_harga_tax: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="btn btn-secondary ms-2"
                                        onClick={() =>
                                            setProductDetails({
                                                ...productDetails,
                                                total_harga_tax:
                                                    productDetails.total_harga +
                                                    (productDetails.total_harga * productDetails.pajak) / 100,
                                            })
                                        }
                                    >
                                        Isi Otomatis
                                    </button>
                                </p>
                                <button className="btn btn-primary mt-3" onClick={handleSaveExpense}>
                                    Save Expense
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSearch;
