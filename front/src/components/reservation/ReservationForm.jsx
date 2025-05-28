
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReservationForm({ selected }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cardInfo, setCardInfo] = useState('');
  const [partySize, setPartySize] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selected || !selected.table_id || !selected.date || !selected.hour || !selected.time_slot_id) {
      alert('테이블과 날짜, 시간이 모두 선택되어야 합니다.');
      return;
    }

    const data = {
      ...selected,
      name,
      phone,
      card_info: cardInfo,
      party_size: partySize
    };

    const res = await fetch('http://localhost:5000/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message);

    if (res.status === 200) {
      setName('');
      setPhone('');
      setCardInfo('');
      setPartySize('');
      navigate('/main');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />
      <input
        type="tel"
        placeholder="전화번호"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="카드번호"
        value={cardInfo}
        onChange={(e) => setCardInfo(e.target.value)}
      /><br />
      <input
        type="number"
        placeholder="총 인원"
        value={partySize}
        onChange={(e) => setPartySize(e.target.value)}
      /><br />
      <button onClick={handleSubmit}>예약하기</button>
    </div>
  );
}

export default ReservationForm;