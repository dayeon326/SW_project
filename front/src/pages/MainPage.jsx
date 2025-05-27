import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

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
    <div>
      <h2>환영합니다!</h2>
      <button onClick={() => navigate('/tables')}>예약하기</button>
      <button onClick={() => navigate('/history')}>예약 내역 보기</button>
      <button onClick={handleLogout}>로그아웃</button> 
    </div>
  );
}

export default MainPage;
