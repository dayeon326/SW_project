DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS time_slots;
DROP TABLE IF EXISTS reservations;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT
);

CREATE TABLE tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL
);

CREATE TABLE time_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,       -- 점심/저녁
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL
);

CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    table_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time_slot_id INTEGER NOT NULL,
    hour INTEGER,  
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    card_info TEXT NOT NULL,
    party_size INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(table_id) REFERENCES tables(id),
    FOREIGN KEY(time_slot_id) REFERENCES time_slots(id)
);

