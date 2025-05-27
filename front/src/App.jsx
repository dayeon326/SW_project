import React, { useState } from 'react';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import TableFilter from './components/reservation/TableFilter';
import TableList from './components/reservation/TableList';
import DateTimeForm from './components/reservation/DateTimeForm';
import ReservationForm from './components/reservation/ReservationForm';
import ReservationList from './components/reservation/ReservationList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tables, setTables] = useState([]);
  const [timeSlotId, setTimeSlotId] = useState(null);
  const [selected, setSelected] = useState({
    table_id: null,
    date: null,
    hour: null,
    time_slot_id: null,
  });

  // 로그인 성공
  const handleLoginSuccess = () => setIsLoggedIn(true);

  // 로그아웃
  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.reload(); // 간단한 초기화
  };

  // 필터 완료 후 테이블 목록 수신
  const handleTablesLoaded = (tables, timeSlotId) => {
    setTables(tables);
    setTimeSlotId(timeSlotId);
    setSelected((prev) => ({ ...prev, time_slot_id: timeSlotId }));
  };

  // 테이블 선택
  const handleSelectTable = (table_id) => {
    setSelected((prev) => ({ ...prev, table_id }));
  };

  // 날짜/시간 확정
  const handleDateTimeConfirmed = ({ date, hour }) => {
    setSelected((prev) => ({ ...prev, date, hour }));
  };

  return (
    <div>
      <h1>레스토랑 예약 시스템</h1>

      {/* 로그인/회원가입/로그아웃 */}
      <Signup />
      <Login onLoginSuccess={handleLoginSuccess} />
      <Logout onLogout={handleLogout} />

      {/* 로그인 이후에만 예약 기능 표시 */}
      {isLoggedIn && (
        <>
          <TableFilter onTablesLoaded={handleTablesLoaded} />
          <TableList tables={tables} onSelectTable={handleSelectTable} />
          <DateTimeForm
            timeSlotId={timeSlotId}
            tableId={selected.table_id}
            onConfirmed={handleDateTimeConfirmed}
          />
          <ReservationForm selected={selected} />
          <ReservationList />
        </>
      )}
    </div>
  );
}

export default App;
