import React, { useEffect, useState } from 'react';

function ReservationList() {
  const [reservations, setReservations] = useState([]);

  const loadReservations = async () => {
    try {
      const res = await fetch('http://localhost:5000/reservations', {
        credentials: 'include', // 쿠키 포함 (로그인 유지)
      });
      if (!res.ok) throw new Error('불러오기 실패');
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error(err);
      alert('예약 내역을 불러올 수 없습니다.');
    }
  };

  const cancelReservation = async (id) => {
    const res = await fetch(`http://localhost:5000/cancel/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const result = await res.json();
    alert(result.message);
    loadReservations();
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <div>
      {reservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <ul>
          {reservations.map((r) => (
            <li key={r.id}>
              {`${r.date} / ${r.location} / ${r.party_size}인 / ${r.hour}:00`}
              <button onClick={() => cancelReservation(r.id)}>취소</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReservationList;
