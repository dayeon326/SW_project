from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = 'secret-key'
CORS(app, supports_credentials=True) #쿠키 설정

DB = 'restaurant.db'

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return send_from_directory('front', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('front', path)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    db = get_db()
    try:
        db.execute("INSERT INTO users (username, password, phone) VALUES (?, ?, ?)",
                   (data['username'], data['password'], data.get('phone', '')))
        db.commit()
        return jsonify({'message': '회원가입 성공'})
    except:
        return jsonify({'message': '이미 존재하는 아이디입니다.'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ? AND password = ?",
                      (data['username'], data['password'])).fetchone()
    if user:
        session['user_id'] = user['id']
        return jsonify({'message': '로그인 성공'})
    return jsonify({'message': '로그인 실패'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    if 'user_id' not in session:
        return jsonify({'message': '이미 로그아웃 상태입니다.'}), 400
    session.clear()
    return jsonify({'message': '로그아웃 되었습니다.'})

@app.route('/tables/filters', methods=['GET'])
def get_table_filters():
    db = get_db()
    times = db.execute('SELECT * FROM time_slots').fetchall()
    locations = db.execute('SELECT DISTINCT location FROM tables').fetchall()
    capacities = db.execute('SELECT DISTINCT capacity FROM tables').fetchall()
    return jsonify({
        'time_slots': [dict(t) for t in times],
        'locations': [r['location'] for r in locations],
        'capacities': [r['capacity'] for r in capacities]
    })

@app.route('/tables/available', methods=['POST'])
def available_tables():
    if 'user_id' not in session:
        return jsonify({'message': '로그인이 필요합니다.'}), 401

    data = request.json
    time_slot_id = data['time_slot_id']
    location = data['location']
    capacity = data['capacity']

    db = get_db()
    reserved_ids = db.execute('''
        SELECT table_id FROM reservations
        WHERE time_slot_id = ?
    ''', (time_slot_id,)).fetchall()
    reserved_ids = [r['table_id'] for r in reserved_ids]

    query = '''
        SELECT * FROM tables
        WHERE location = ? AND capacity = ?
    '''
    rows = db.execute(query, (location, capacity)).fetchall()
    available = [dict(r) for r in rows if r['id'] not in reserved_ids]
    return jsonify(available)

@app.route('/check-availability', methods=['POST'])
def check_availability():
    if 'user_id' not in session:
        return jsonify({'message': '로그인이 필요합니다.'}), 401

    data = request.json
    table_id = data['table_id']
    date = data['date']
    time_slot_id = data['time_slot_id']
    hour = data['hour']

    db = get_db()
    exists = db.execute('''
        SELECT * FROM reservations
        WHERE table_id = ? AND date = ? AND time_slot_id = ? AND hour = ?
    ''', (table_id, date, time_slot_id, hour)).fetchone()

    if exists:
        return jsonify({'message': '이미 선택한 날짜 및 시간에 예약된 테이블입니다.'}), 409

    return jsonify({'message': '예약 가능'})

@app.route('/reserve', methods=['POST'])
def reserve():
    if 'user_id' not in session:
        return jsonify({'message': '로그인이 필요합니다.'}), 401

    data = request.json
    try:
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'message': '날짜 형식 오류'}), 400

    today = datetime.today().date()
    if date > today + timedelta(days=30):
        return jsonify({'message': '한 달 이내만 예약 가능'}), 400

    hour = data.get('hour')

    db = get_db()
    exists = db.execute('''
        SELECT * FROM reservations
        WHERE table_id=? AND date=? AND time_slot_id=? AND hour=?
    ''', (data['table_id'], data['date'], data['time_slot_id'], hour)).fetchone()

    if exists:
        return jsonify({'message': '이미 예약된 테이블입니다.'}), 400

    db.execute('''
        INSERT INTO reservations (user_id, table_id, date, time_slot_id, hour, name, phone, card_info, party_size)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (session['user_id'], data['table_id'], data['date'], data['time_slot_id'], hour,
          data['name'], data['phone'], data['card_info'], data['party_size']))
    db.commit()
    return jsonify({'message': '예약이 완료되었습니다.'})

@app.route('/reservations', methods=['GET'])
def my_reservations():
    if 'user_id' not in session:
        return jsonify([])

    db = get_db()
    rows = db.execute('''
        SELECT r.*, t.location FROM reservations r
        JOIN tables t ON r.table_id = t.id
        WHERE r.user_id = ?
    ''', (session['user_id'],)).fetchall()
    return jsonify([dict(row) for row in rows])

@app.route('/cancel/<int:res_id>', methods=['DELETE'])
def cancel(res_id):
    if 'user_id' not in session:
        return jsonify({'message': '로그인이 필요합니다.'}), 401

    db = get_db()
    res = db.execute('SELECT * FROM reservations WHERE id = ? AND user_id = ?', (res_id, session['user_id'])).fetchone()
    if not res:
        return jsonify({'message': '예약을 찾을 수 없습니다.'}), 404
    date = datetime.strptime(res['date'], '%Y-%m-%d').date()
    if (date - datetime.today().date()).days < 1:
        return jsonify({'message': '하루 전까지만 취소할 수 있습니다.'}), 400
    db.execute('DELETE FROM reservations WHERE id = ?', (res_id,))
    db.commit()
    return jsonify({'message': '예약이 취소되었습니다.'})

if __name__ == '__main__':
    app.run(debug=True)
