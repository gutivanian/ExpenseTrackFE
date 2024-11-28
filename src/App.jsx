import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Mengimpor Router dan Routes
import ProductSearch from './components/ProductSearch';  // Pastikan path sesuai dengan lokasi komponen Anda
import 'bootstrap/dist/css/bootstrap.min.css';  // Mengimpor bootstrap CSS
import IncomeList from './pages/IncomeList';
import AddIncomeForm from './pages/AddIncomeForm';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <h1 className="my-4">Spending Tracker</h1>
          <Routes>
            {/* Definisikan rute untuk ProductSearch */}
            <Route path="/" element={<ProductSearch />} />
            {/* Tambahkan rute untuk halaman lain */}
            <Route path="/income-list" element={<IncomeList />} />
            <Route path="/add-income" element={<AddIncomeForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
