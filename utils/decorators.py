from functools import wraps
from flask import session, jsonify

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': '로그인이 필요합니다.'}), 401
        return f(*args, **kwargs)
    return decorated
