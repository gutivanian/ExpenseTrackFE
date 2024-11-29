import React from 'react';
import SearchBox from './SearchBox';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const TransactionBox = ({
    transaction,
    onToggleVisibility,
    onSearchChange,
    onSelectProduct,
    onInputChange,
    onRemoveTransaction,
}) => {
    const {
        id,
        transactionBoxVisible,
        searchTerm,
        products,
        selectedProduct,
        productDetails,
    } = transaction;

    const getNumber = (value) => {
        // Helper function to parse value as float and ensure it's a number
        return parseFloat(value) || 0;
    };

    const handleSaveExpense = async () => {
        if (!selectedProduct) {
            alert('Please select a product before saving.');
            return;
        }

        const expenseData = {
            product_id: selectedProduct.id,
            quantity: productDetails.quantity || 0,
            total_harga: getNumber(productDetails.total_harga),
            pajak: getNumber(productDetails.pajak),
            total_harga_tax: getNumber(productDetails.total_harga_tax),
            date: new Date().toISOString().slice(0, 10), // Adjust date format if needed
        };

        try {
            const response = await axios.post(`${apiUrl}/expenses`, expenseData);
            if (response.status === 200 || response.status === 201) {
                alert('Expense saved successfully!');
            } else {
                alert('Failed to save expense. Please try again.');
            }
        } catch (error) {
            console.error('Error saving expense:', error);
            alert('An error occurred while saving the expense.');
        }
    };

    return (
        <div className="card shadow-sm p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title">Proses Transaksi</h5>
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onToggleVisibility(id)}
                >
                    {transactionBoxVisible ? 'Minimize' : 'Maximize'}
                </button>
            </div>
            {transactionBoxVisible && (
                <div>
                    {/* Search Box */}
                    <SearchBox
                        searchTerm={searchTerm}
                        onSearchChange={(term) => onSearchChange(id, term)}
                        products={products}
                        onSelectProduct={(product) => onSelectProduct(id, product)}
                    />

                    {/* Transaction Details */}
                    {selectedProduct && (
                        <div className="mt-4">
                            <h6>Nama Produk: {selectedProduct.nama_produk}</h6>
                            <p>Toko: {selectedProduct.toko}</p>
                            <p>Kategori: {selectedProduct.kategori}</p>
                            <p>Subkategori: {selectedProduct.subkategori}</p>

                            <p>
                                Harga:
                                <input
                                    type="number"
                                    className="form-control d-inline w-50"
                                    value={productDetails.harga || ''}
                                    onChange={(e) =>
                                        onInputChange(id, 'harga', parseFloat(e.target.value) || '')
                                    }
                                />
                            </p>
                            <p>
                                Quantity:
                                <input
                                    type="number"
                                    className="form-control d-inline w-50"
                                    value={productDetails.quantity || ''}
                                    onChange={(e) =>
                                        onInputChange(id, 'quantity', parseInt(e.target.value) || '')
                                    }
                                />
                            </p>
                            <p>
                                Total Harga:
                                <input
                                    type="number"
                                    className="form-control d-inline w-50"
                                    value={getNumber(productDetails.total_harga).toFixed(2)}
                                    readOnly
                                />
                            </p>
                            <p>
                                Tax (Rp):
                                <input
                                    type="number"
                                    className="form-control d-inline w-50"
                                    value={productDetails.pajak || ''}
                                    onChange={(e) =>
                                        onInputChange(id, 'pajak', e.target.value === '' ? '' : parseFloat(e.target.value))
                                    }
                                />
                                <button
                                    className="btn btn-secondary ms-2"
                                    onClick={() =>
                                        onInputChange(
                                            id,
                                            'pajak',
                                            getNumber(productDetails.total_harga_tax) - getNumber(productDetails.total_harga)
                                        )
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
                                    value={productDetails.total_harga_tax || ''}
                                    onChange={(e) =>
                                        onInputChange(
                                            id,
                                            'total_harga_tax',
                                            e.target.value === '' ? '' : parseFloat(e.target.value)
                                        )
                                    }
                                />
                                <button
                                    className="btn btn-secondary ms-2"
                                    onClick={() =>
                                        onInputChange(
                                            id,
                                            'total_harga_tax',
                                            getNumber(productDetails.total_harga) + getNumber(productDetails.pajak)
                                        )
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
            <button
                className="btn btn-danger mt-3"
                onClick={() => onRemoveTransaction(id)}
            >
                Remove Transaction
            </button>
        </div>
    );
};

export default TransactionBox;
