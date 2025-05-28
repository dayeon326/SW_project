import React from 'react';
import { useLocation } from 'react-router-dom';
import ReservationForm from '../components/reservation/ReservationForm';
import Header from '../layout/Header';

function ReservationPage() {
  const { state } = useLocation(); // table_id, time_slot_id, date, hour 등

  return (
    <div>
      <Header />
      <h2>예약 정보 입력</h2>
      <ReservationForm selected={state} />
    </div>
  );
}

export default ReservationPage;
