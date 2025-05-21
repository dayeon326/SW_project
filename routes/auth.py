from flask import Blueprint, request, session, jsonify
from db.database import get_db
from utils.hashing import hash_password, verify_password

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.json
    db = get_db()
    try:
        db.execute("INSERT INTO users (username, password) VALUES (?, ?)",
                   (data['username'], hash_password(data['password'])))
        db.commit()
        return jsonify({'message': '회원가입 성공'})
    except:
        return jsonify({'message': '이미 존재하는 아이디입니다.'}), 400

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = get_db().execute("SELECT * FROM users WHERE username = ?", (data['username'],)).fetchone()
    if user and verify_password(user['password'], data['password']):
        session['user_id'] = user['id']
        return jsonify({'message': '로그인 성공'})
    return jsonify({'message': '로그인 실패'}), 401

@auth.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': '로그아웃 완료'})
