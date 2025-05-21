from flask import Blueprint, request, session, jsonify
from db.database import get_db
from utils.decorators import login_required

user = Blueprint('user', __name__)

@user.route('/update_phone', methods=['POST'])
@login_required
def update_phone():
    phone = request.json.get('phone')
    db = get_db()
    db.execute("UPDATE users SET phone = ? WHERE id = ?", (phone, session['user_id']))
    db.commit()
    return jsonify({'message': '전화번호 변경 완료'})
