import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';  // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css';  // Jangan lupa untuk impor CSS-nya
import { useNavigate } from 'react-router-dom'; 
const AddIncomeForm = () => {
    const [kategori, setKategori] = useState('');
    const [subkategori, setSubkategori] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [date, setDate] = useState(null); // Defaultnya null
    const navigate = useNavigate();


    console.log(date)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const incomeData = {
            kategori,
            subkategori,
            jumlah: parseFloat(jumlah),
            date, // Mengubah format tanggal ke string
        };

        try {
            const response = await axios.post('/api/personal-income', incomeData);
            if (response.status === 201) {
                alert('Pendapatan berhasil ditambahkan!');
            }
        } catch (error) {
            console.error('Error saving income:', error);
            alert('Gagal menambahkan pendapatan');
        }
    };

    return (
        <div className="container">
            <button
                onClick={() => navigate('/')} // Navigasi ke halaman utama
                className="btn btn-secondary mt-3"
            >
                Kembali ke Halaman Utama
            </button>
            <h2 className="my-4">Tambah Pendapatan Pribadi</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Kategori</label>
                    <input
                        type="text"
                        className="form-control"
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Subkategori</label>
                    <input
                        type="text"
                        className="form-control"
                        value={subkategori}
                        onChange={(e) => setSubkategori(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Jumlah</label>
                    <input
                        type="number"
                        className="form-control"
                        value={jumlah}
                        onChange={(e) => setJumlah(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tanggal</label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)} // Update state dengan tanggal yang dipilih
                        dateFormat="yyyy-MM-dd" // Format tanggal
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Simpan Pendapatan</button>
            </form>
        </div>
    );
};

export default AddIncomeForm;
