import React, { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const IncomeList = () => {
    const [incomeData, setIncomeData] = useState([]);

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const response = await axios.get(`${apiUrl}/personal-income`);
                setIncomeData(response.data);
            } catch (error) {
                console.error('Error fetching income data', error);
            }
        };

        fetchIncome();
    }, []);

    return (
        <div className="container">
            <h1 className="my-4">Daftar Pendapatan Pribadi</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kategori</th>
                        <th>Subkategori</th>
                        <th>Jumlah</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    {incomeData.map((income) => (
                        <tr key={income.id}>
                            <td>{income.id}</td>
                            <td>{income.kategori}</td>
                            <td>{income.subkategori}</td>
                            <td>{income.jumlah}</td>
                            <td>{new Date(income.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeList;
