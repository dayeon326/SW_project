import React from 'react';
import Header from '../layout/Header';

function HomePage() {
  return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>환영합니다!</h1>
      </div>
    </div>
  );
}

export default HomePage;
