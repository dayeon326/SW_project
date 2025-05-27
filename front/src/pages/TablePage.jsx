import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TableFilter from '../components/reservation/TableFilter';
import TableList from '../components/reservation/TableList';

function TablePage() {
  const [tables, setTables] = useState([]);
  const [timeSlotId, setTimeSlotId] = useState(null);
  const navigate = useNavigate();

  // 필터 완료 시
  const handleTablesLoaded = (loaded, slot) => {
    setTables(loaded);
    setTimeSlotId(slot);
  };

  // 테이블 선택 시 → 날짜/시간 선택 페이지로 이동
  const handleSelectTable = (id) => {
    navigate('/datetime', {
      state: {
        table_id: id,
        time_slot_id: timeSlotId,
      }
    });
  };

  return (
    <div>
      <h2>테이블 예약</h2>
      <TableFilter onTablesLoaded={handleTablesLoaded} />
      <TableList tables={tables} onSelectTable={handleSelectTable} />
    </div>
  );
}

export default TablePage;
