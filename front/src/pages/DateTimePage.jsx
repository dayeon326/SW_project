import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';

function DateTimePage() {
  const { state } = useLocation(); // table_id, time_slot_id 받기
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');

  const handleConfirm = () => {
    if (!date || !hour) {
      alert('날짜와 시간을 모두 선택하세요.');
      return;
    }

    navigate('/reservation', {
      state: {
        table_id: state.table_id,
        time_slot_id: state.time_slot_id,
        date,
        hour
      }
    });
  };

  const timeOptions = () => {
    const range = state.time_slot_id === 1 ? [11, 15] : [17, 21];
    return range.map(h => (
      <option key={h} value={h}>{`${h}:00 - ${h + 1}:00`}</option>
    ));
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        <h2>날짜 및 시간 선택</h2>
        <label>
          날짜:
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <br />
        <label>
          시간:
          <select value={hour} onChange={e => setHour(e.target.value)}>
            <option value="">선택</option>
            {timeOptions()}
          </select>
        </label>
        <br />
        <button onClick={handleConfirm}>확정</button>
      </div>
    </>
  );
}

export default DateTimePage;
