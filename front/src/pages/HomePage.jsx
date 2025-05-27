import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>레스토랑 예약 시스템</h1>
      <div style={{ margin: '20px' }}>
        <button onClick={goToLogin}>로그인</button>
        <button onClick={goToSignup} style={{ marginLeft: '10px' }}>회원가입</button>
      </div>
    </div>
  );
}

export default HomePage;
