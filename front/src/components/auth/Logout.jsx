import React from 'react';

function Logout({ onLogout }) {
  const logout = async () => {
    const res = await fetch('http://localhost:5000/logout', { method: 'POST' });
    const data = await res.json();
    alert(data.message);

    if (res.status === 200 && onLogout) {
      onLogout(); 
    }
  };

  return (
    <div>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}

export default Logout;
