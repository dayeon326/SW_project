from flask import Blueprint, request, session, jsonify
from db.database import get_db
from utils.decorators import login_required
from datetime import datetime, timedelta

resv = Blueprint('resv', __name__)

@resv.route('/tables', methods=['GET'])
@login_required
def get_tables():
    db = get_db()
    tables = db.execute("SELECT * FROM tables").fetchall()
    return jsonify([dict(row) for row in tables])

@resv.route('/reserve', methods=['POST'])
@login_required
def reserve():
    data = request.json
    db = get_db()

    today = datetime.today().date()
    target_date = datetime.strptime(data['date'], "%Y-%m-%d").date()

    if target_date > today + timedelta(days=30):
        return jsonify({'message': '1개월 이내로만 예약 가능'}), 400

    check = db.execute(
        "SELECT * FROM reservations WHERE table_id=? AND date=? AND time_slot_id=?",
        (data['table_id'], data['date'], data['time_slot_id'])
    ).fetchone()

    if check:
        return jsonify({'message': '이미 예약된 테이블입니다'}), 400

    db.execute("""
        INSERT INTO reservations (user_id, table_id, date, time_slot_id, name, phone, card_info, party_size)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (session['user_id'], data['table_id'], data['date'], data['time_slot_id'],
          data['name'], data['phone'], data['card_info'], data['party_size']))
    db.commit()
    return jsonify({'message': '예약 완료'})

@resv.route('/my_reservations', methods=['GET'])
@login_required
def my_reservations():
    db = get_db()
    res = db.execute("SELECT * FROM reservations WHERE user_id=?", (session['user_id'],)).fetchall()
    return jsonify([dict(r) for r in res])

@resv.route('/cancel/<int:res_id>', methods=['DELETE'])
@login_required
def cancel(res_id):
    db = get_db()
    reservation = db.execute("SELECT * FROM reservations WHERE id=? AND user_id=?", (res_id, session['user_id'])).fetchone()
    if not reservation:
        return jsonify({'message': '예약 없음'}), 404

    res_date = datetime.strptime(reservation['date'], "%Y-%m-%d").date()
    if (res_date - datetime.today().date()).days < 1:
        return jsonify({'message': '예약은 하루 전까지 취소 가능'}), 400

    db.execute("DELETE FROM reservations WHERE id=?", (res_id,))
    db.commit()
    return jsonify({'message': '취소 완료'})
