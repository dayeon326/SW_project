import sqlite3

conn = sqlite3.connect('restaurant.db')
c = conn.cursor()

# 시간대
c.execute("INSERT OR IGNORE INTO time_slots (id, name, start_time, end_time) VALUES (1, '점심', '12:00', '14:00')")
c.execute("INSERT OR IGNORE INTO time_slots (id, name, start_time, end_time) VALUES (2, '저녁', '18:00', '20:00')")

# 테이블
c.execute("INSERT OR IGNORE INTO tables (id, location, capacity) VALUES (1, '창가', 2)")
c.execute("INSERT OR IGNORE INTO tables (id, location, capacity) VALUES (2, '중앙', 4)")
c.execute("INSERT OR IGNORE INTO tables (id, location, capacity) VALUES (3, '룸', 6)")

conn.commit()
conn.close()
print("Seed 완료")

# db 초기화
# sqlite3 restaurant.db < db/schema.sql     # 테이블 구조 정의
# python db/seed.py                         # 초기 데이터 삽입
#