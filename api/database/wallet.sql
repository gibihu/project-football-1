
CREATE TABLE IF NOT EXISTS wallet (
    id CHAR(36) PRIMARY KEY, -- UUID ของ wallet
    user_uuid CHAR(36) NOT NULL UNIQUE,
    points BIGINT DEFAULT 0, -- จำนวน point ปัจจุบัน
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
);

-- ตาราง history ของ wallet (optional แต่แนะนำ)
CREATE TABLE IF NOT EXISTS wallet_history (
    id CHAR(36) PRIMARY KEY, -- UUID ของรายการ
    wallet_id CHAR(36) NOT NULL,
    change_amount BIGINT NOT NULL, -- เพิ่มเป็นบวก ลดเป็นลบ
    type ENUM('add','subtract') NOT NULL,
    description VARCHAR(255), -- เหตุผลหรือรายละเอียด
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallet(id) ON DELETE CASCADE
);