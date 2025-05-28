import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/');
  };

  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');
  const goToTable = () => navigate('/tables');
  const goToHistory = () => navigate('/history');

  // 현재 페이지 확인
  const isMainPage = location.pathname === '/main';
  const isHome = location.pathname === '/';

  return (
    <header style={styles.header}>
      <h2 style={styles.title}>레스토랑 예약 시스템</h2>
      <nav style={styles.nav}>
        {isMainPage ? (
          <>
            <button onClick={goToTable} style={styles.button}>예약하기</button>
            <button onClick={goToHistory} style={styles.button}>예약 내역 보기</button>
            <button onClick={logout} style={styles.button}>로그아웃</button>
          </>
        ) : isHome ? (
          <>
            <button onClick={goToLogin} style={styles.button}>로그인</button>
            <button onClick={goToSignup} style={styles.button}>회원가입</button>
          </>
        ) : null}
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
