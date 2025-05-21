let selected = { table_id: null, time_slot_id: null, hour: null, date: null };

async function signup() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  alert((await res.json()).message);
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  alert((await res.json()).message);
  loadReservations();
}

async function logout() {
  const res = await fetch('/logout', { method: 'POST' });
  const data = await res.json();
  alert(data.message);

  if (res.status === 200) {
    location.reload();
  }
}

window.onload = async () => {
  const res = await fetch('/tables/filters');
  const data = await res.json();

  data.locations.forEach(l => {
    const o = new Option(l, l);
    document.getElementById('location').appendChild(o);
  });
  data.capacities.forEach(c => {
    const o = new Option(`${c}인`, c);
    document.getElementById('capacity').appendChild(o);
  });


  const timeSlotEl = document.getElementById('time_slot');
  const timeListEl = document.getElementById('time_list');
  timeSlotEl.addEventListener('change', () => {
    const value = timeSlotEl.value;
    timeListEl.innerHTML = '';
    const range = value === 'lunch' ? [11, 15] : [17, 21];
    for (let i = range[0]; i < range[1]; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${i}:00 - ${i + 1}:00`;
      timeListEl.appendChild(opt);
    }
  });

  timeSlotEl.dispatchEvent(new Event('change'));

  loadReservations();
};


async function loadTables() {
  const period = document.getElementById('time_slot').value;
  const location = document.getElementById('location').value;
  const capacity = document.getElementById('capacity').value;

  if (!period || !location || !capacity) {
    return alert('모든 필드를 선택하세요.');
  }

  const time_slot_id = period === 'lunch' ? 1 : 2;
  selected.time_slot_id = time_slot_id;

  const res = await fetch('/tables/available', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time_slot_id, location, capacity })
  });

  if (res.status === 401) return alert('로그인이 필요합니다.');

  const data = await res.json();
  if (!data.length) {
    document.getElementById('datetime-form').style.display = 'none';
    return alert('선택한 시간대에 예약 가능한 테이블이 없습니다.');
  }

  const list = document.getElementById('tables');
  list.innerHTML = '';
  data.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `#${t.id} - ${t.location} (${t.capacity}인)`;
    li.onclick = () => {
      selected.table_id = t.id;
      document.getElementById('datetime-form').style.display = 'block';
    };
    list.appendChild(li);
  });
}

function confirmDateTime() {
  const date = document.getElementById('date').value;
  const hour = document.getElementById('time_list').value;
  if (!date || !hour) return alert('날짜와 시간을 선택하세요.');

  const today = new Date();
  const selectedDate = new Date(date);
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  if (selectedDate > maxDate) {
    return alert('한 달 이내만 예약 가능합니다.');
  }

  selected.date = date;
  selected.hour = hour;

  fetch('/check-availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      table_id: selected.table_id,
      date,
      time_slot_id: selected.time_slot_id,
      hour
    })
  })
    .then(res => {
      if (res.status === 409) {
        alert('이미 예약된 시간입니다. 다른 시간을 선택하세요.');
        return;
      }
      document.getElementById('form').style.display = 'block';
    });
}

async function submitReservation() {
  const data = {
    ...selected,
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    card_info: document.getElementById('card').value,
    party_size: document.getElementById('party').value
  };

  const res = await fetch('/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
  loadReservations();
}

async function loadReservations() {
  const res = await fetch('/reservations');
  const data = await res.json();
  const list = document.getElementById('reservations');
  list.innerHTML = '';
  data.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.date} / ${r.location} / ${r.party_size}인 / ${r.hour}:00`;
    const btn = document.createElement('button');
    btn.textContent = '취소';
    btn.onclick = async () => {
      const cancelRes = await fetch(`/cancel/${r.id}`, { method: 'DELETE' });
      const msg = await cancelRes.json();
      alert(msg.message);
      loadReservations();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

const timeSlotEl = document.getElementById('time_slot');
const timeListEl = document.getElementById('time_list');
timeSlotEl.addEventListener('change', () => {
  const value = timeSlotEl.value;
  timeListEl.innerHTML = '';
  const range = value === 'lunch' ? [11, 15] : [17, 21];
  for (let i = range[0]; i < range[1]; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${i}:00 - ${i + 1}:00`;
    timeListEl.appendChild(opt);
  }
});
