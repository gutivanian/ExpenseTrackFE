import React, { useState } from 'react';
import TransactionBox from './TransactionBox';
import ModalManualInput from './ModalManualInput';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
const apiUrl = import.meta.env.VITE_API_URL;
const ProductSearch = () => {
    const [transactions, setTransactions] = useState([
        {
            id: Date.now(),
            searchTerm: '',
            products: [],
            selectedProduct: null,
            productDetails: {
                nama_produk: '',
                toko: '',
                kategori: '',
                subkategori: '',
                harga: '',
                date: '',
                quantity: 1,
                pajak: 0,
                total_harga: 0,
                total_harga_tax: 0,
            },
            transactionBoxVisible: true,
        },
    ]);
    const navigate = useNavigate();

    const [manualProduct, setManualProduct] = useState(false); // Global modal state
    const [manualProductDetails, setManualProductDetails] = useState({
        nama_produk: '',
        toko: '',
        kategori: '',
        subkategori: '',
        harga: '',
    });

    const handleAddTransaction = () => {
        setTransactions([
            ...transactions,
            {
                id: Date.now(),
                searchTerm: '',
                products: [],
                selectedProduct: null,
                productDetails: {
                    nama_produk: '',
                    toko: '',
                    kategori: '',
                    subkategori: '',
                    harga: '',
                    date: '',
                    quantity: 1,
                    pajak: 0,
                    total_harga: 0,
                    total_harga_tax: 0,
                },
                transactionBoxVisible: true,
            },
        ]);
    };

    const handleRemoveTransaction = (id) => {
        setTransactions(transactions.filter((transaction) => transaction.id !== id));
    };

    const handleToggleVisibility = (id) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === id
                    ? { ...transaction, transactionBoxVisible: !transaction.transactionBoxVisible }
                    : transaction
            )
        );
    };

    const handleSearchChange = (id, term) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === id ? { ...transaction, searchTerm: term } : transaction
            )
        );
    
        // Fetch products from API
        if (term) {
            fetch(`${apiUrl}/products?search=${term}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Fetched products:", data); // Debugging
                    setTransactions((prev) =>
                        prev.map((transaction) =>
                            transaction.id === id
                                ? { ...transaction, products: data }
                                : transaction
                        )
                    );
                })
                .catch((error) => console.error('Error fetching products:', error));
        } else {
            // Clear products if search term is empty
            setTransactions((prev) =>
                prev.map((transaction) =>
                    transaction.id === id ? { ...transaction, products: [] } : transaction
                )
            );
        }
    };
    

    const handleSelectProduct = (id, product) => {
        console.log("Product selected:", product); // Debugging
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === id
                    ? {
                          ...transaction,
                          selectedProduct: product,
                          productDetails: {
                              ...transaction.productDetails,
                              nama_produk: product.nama_produk,
                              toko: product.toko,
                              kategori: product.kategori,
                              subkategori: product.subkategori,
                              harga: product.harga,
                              total_harga: product.harga,
                              total_harga_tax: 0,
                          },
                          searchTerm: '',
                          products: [],
                      }
                    : transaction
            )
        );
    };
    

    const handleInputChange = (id, field, value) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === id
                    ? {
                          ...transaction,
                          productDetails: {
                              ...transaction.productDetails,
                              [field]: value,
                              ...(field === 'quantity' || field === 'harga'
                                  ? {
                                        total_harga:
                                            (field === 'quantity'
                                                ? value
                                                : transaction.productDetails.quantity) *
                                            (field === 'harga'
                                                ? value
                                                : transaction.productDetails.harga),
                                    }
                                  : {}),
                          },
                      }
                    : transaction
            )
        );
    };

    const handleSaveAllExpenses = async () => {
        const unsavedTransactions = transactions.filter(
            (transaction) =>
                transaction.selectedProduct &&
                transaction.productDetails.quantity &&
                transaction.productDetails.total_harga
        );
    
        if (unsavedTransactions.length === 0) {
            alert('No transactions to save. Please fill in the required details.');
            return;
        }
    
        try {
            for (const transaction of unsavedTransactions) {
                const expenseData = {
                    product_id: transaction.selectedProduct.id,
                    quantity: transaction.productDetails.quantity,
                    total_harga: transaction.productDetails.total_harga,
                    pajak: transaction.productDetails.pajak || 0,
                    total_harga_tax: transaction.productDetails.total_harga_tax || 0,
                    date: new Date().toISOString().slice(0, 10), // Adjust date format if needed
                };
    
                await axios.post(`${apiUrl}/expenses`, expenseData);
            }
    
            alert('All expenses saved successfully in queue!');
        } catch (error) {
            console.error('Error saving expenses:', error);
            alert('An error occurred while saving expenses in queue.');
        }
    };
    
    

    const handleSaveManualProduct = async () => {
        try {
            const response = await axios.post(`${apiUrl}/products`, manualProductDetails);
            if (response.status === 201) {
                alert('Manual product saved successfully!');
                setManualProduct(false); // Tutup modal setelah berhasil
                setManualProductDetails({
                    nama_produk: '',
                    toko: '',
                    kategori: '',
                    subkategori: '',
                    harga: '',
                }); // Reset form
            } else {
                alert('Failed to save manual product. Please try again.');
            }
        } catch (error) {
            console.error('Error saving manual product:', error);
            alert('An error occurred while saving the manual product.');
        }
    };
    
    return (
        <div className="container mt-3">
            <button
                onClick={() => navigate('/add-income')} // Navigasi ke halaman utama
                className="btn btn-secondary mt-3"
            >
                Tambah Income
            </button>
            {/* Modal Manual Input */}
            <ModalManualInput
                isVisible={manualProduct}
                onClose={() => setManualProduct(false)}
                productDetails={manualProductDetails}
                handleInputChange={(field, value) =>
                    setManualProductDetails({ ...manualProductDetails, [field]: value })
                }
                handleSaveManualProduct={handleSaveManualProduct}
            />
    
            {/* Transaction Boxes */}
            {transactions.map((transaction) => (
                <TransactionBox
                    key={transaction.id}
                    transaction={transaction}
                    onToggleVisibility={handleToggleVisibility}
                    onSearchChange={handleSearchChange}
                    onSelectProduct={handleSelectProduct}
                    onInputChange={handleInputChange}
                    onRemoveTransaction={handleRemoveTransaction}
                />
            ))}
    
            <div className="d-flex mt-4">
                <button className="btn btn-primary me-2" onClick={handleAddTransaction}>
                    + Add Transaction
                </button>
                <button className="btn btn-secondary me-2" onClick={() => setManualProduct(true)}>
                    Add Product Manually
                </button>
                <button className="btn btn-success" onClick={handleSaveAllExpenses}>
                    Save All
                </button>
            </div>
        </div>
    );
    
};

export default ProductSearch;
