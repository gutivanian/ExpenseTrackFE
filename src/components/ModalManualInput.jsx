import React from 'react';

const ModalManualInput = ({ isVisible, onClose, productDetails, handleInputChange, handleSaveManualProduct }) => {
    if (!isVisible) return null;
    const apiUrl = import.meta.env.VITE_API_URL;
    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Input Product Manually</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <label>Nama Produk:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={productDetails.nama_produk}
                            onChange={(e) => handleInputChange('nama_produk', e.target.value)}
                        />
                        <label>Toko:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={productDetails.toko}
                            onChange={(e) => handleInputChange('toko', e.target.value)}
                        />
                        <label>Kategori:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={productDetails.kategori}
                            onChange={(e) => handleInputChange('kategori', e.target.value)}
                        />
                        <label>Subkategori:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={productDetails.subkategori}
                            onChange={(e) => handleInputChange('subkategori', e.target.value)}
                        />
                        <label>Harga:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={productDetails.harga}
                            onChange={(e) => handleInputChange('harga', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSaveManualProduct}>
                            Save Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalManualInput;
