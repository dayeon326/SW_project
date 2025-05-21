from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    return generate_password_hash(password)

def verify_password(stored, input_password):
    return check_password_hash(stored, input_password)
