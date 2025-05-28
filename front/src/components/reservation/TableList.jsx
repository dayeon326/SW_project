import React from 'react';

function TableList({ tables, onSelectTable, hasSearched }) {
  if (!hasSearched) return null; 

  if (!tables || tables.length === 0) {
    return <p>예약 가능한 테이블이 없습니다.</p>;
  }

  return (
    <div>
      <h3>가능한 테이블</h3>
      <ul>
        {tables.map((table) => (
          <li key={table.id}>
            #{table.id} - {table.location} ({table.capacity}인)
            <button onClick={() => onSelectTable(table.id)}>선택</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TableList;
