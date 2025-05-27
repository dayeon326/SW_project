import React, { useEffect, useState } from 'react';

function DateTimeForm({ timeSlotId, tableId, onConfirmed }) {
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [hourOptions, setHourOptions] = useState([]);

  // 시간대 변경 시 시간 옵션 설정
  useEffect(() => {
    if (!timeSlotId) return;

    const range = timeSlotId === 1 ? [11, 15] : [17, 21];
    const options = [];
    for (let i = range[0]; i < range[1]; i++) {
      options.push(i);
    }
    setHourOptions(options);
    setHour(''); // 시간 초기화
  }, [timeSlotId]);

  const handleConfirm = async () => {
    if (!date || !hour) return alert('날짜와 시간을 선택하세요.');
    if (!tableId || !timeSlotId) return alert('테이블을 먼저 선택하세요.');

    const today = new Date();
    const selectedDate = new Date(date);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    if (selectedDate > maxDate) {
      return alert('한 달 이내만 예약 가능합니다.');
    }

    const res = await fetch('http://localhost:5000/check-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify({
        table_id: tableId,
        date,
        time_slot_id: timeSlotId,
        hour
      })
    });

    if (res.status === 409) {
      alert('이미 예약된 시간입니다. 다른 시간을 선택하세요.');
      return;
    }

    onConfirmed({ date, hour }); // 예약 가능하므로 상위로 전달
  };

  return (
    <div>
      <h3>날짜 및 시간 선택</h3>
      <label>
        날짜:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <br />
      <label>
        시간:
        <select value={hour} onChange={(e) => setHour(e.target.value)}>
          <option value="">선택</option>
          {hourOptions.map((h) => (
            <option key={h} value={h}>{`${h}:00 - ${parseInt(h) + 1}:00`}</option>
          ))}
        </select>
      </label>
      <br />
      <button onClick={handleConfirm}>확정</button>
    </div>
  );
}

export default DateTimeForm;
