import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 상태 판단 예시 (쿠키 등 사용하면 개선 가능)
  const isLoggedIn = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

  const handleLogout = async () => {
    const res = await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    alert(data.message);
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <h2 style={styles.title}>레스토랑 예약 시스템</h2>
      <nav style={styles.nav}>
        {isLoggedIn ? (
          <>
            <button onClick={() => navigate('/main')} style={styles.button}>홈</button>
            <button onClick={() => navigate('/tables')} style={styles.button}>예약하기</button>
            <button onClick={() => navigate('/history')} style={styles.button}>예약 내역 보기</button>
            <button onClick={handleLogout} style={styles.button}>로그아웃</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={styles.button}>로그인</button>
            <button onClick={() => navigate('/signup')} style={styles.button}>회원가입</button>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#f2f2f2',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc'
  },
  title: {
    margin: 0,
    fontSize: '24px'
  },
  nav: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer'
  }
};

export default Header;
