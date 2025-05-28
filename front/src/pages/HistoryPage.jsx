import ReservationList from '../components/reservation/ReservationList';
import Header from '../layout/Header';

function HistoryPage() {
  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        <h2>내 예약 내역</h2>
        <ReservationList />
      </div>
    </>
  );
}

export default HistoryPage;
