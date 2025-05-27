import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import TablePage from './pages/TablePage';
import DateTimePage from './pages/DateTimePage';
import ReservationPage from './pages/ReservationPage';
import HistoryPage from './pages/HistoryPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/tables" element={<TablePage />} />
      <Route path="/datetime" element={<DateTimePage />} />
      <Route path="/reservation" element={<ReservationPage />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  </BrowserRouter>
);