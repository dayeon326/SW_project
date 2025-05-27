import React, { useEffect, useState } from 'react';

function TableFilter({ onTablesLoaded }) {
  const [locations, setLocations] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [period, setPeriod] = useState('lunch');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    async function fetchFilters() {
      const res = await fetch('http://localhost:5000/tables/filters');
      const data = await res.json();
      setLocations(data.locations);
      setCapacities(data.capacities);
    }
    fetchFilters();
  }, []);

  const handleSubmit = async () => {
    if (!period || !location || !capacity) return alert('모든 필드를 선택하세요.');
    const time_slot_id = period === 'lunch' ? 1 : 2;
    const res = await fetch('http://localhost:5000/tables/available', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',// 쿠키 포함
      body: JSON.stringify({ time_slot_id, location, capacity })
    });
    if (res.status === 401) return alert('로그인이 필요합니다.');
    const tables = await res.json();
    if (!tables.length) return alert('해당 조건에 테이블 없음');
    onTablesLoaded(tables, time_slot_id);
  };

  return (
    <div>
      <h3>테이블 예약 필터</h3>
      <select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="lunch">점심</option>
        <option value="dinner">저녁</option>
      </select>
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        {locations.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
        {capacities.map(c => <option key={c} value={c}>{c}인</option>)}
      </select>
      <button onClick={handleSubmit}>테이블 보기</button>
    </div>
  );
}

export default TableFilter;
