-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY, -- UUID v4 เก็บเป็น string 36 ตัว
    name VARCHAR(100) NOT NULL DEFAULT 'Unknow Name',
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- ไว้เก็บ hash เช่น bcrypt
    tier ENUM('bronze', 'silver', 'gold', 'vip') DEFAULT 'bronze',
    exp INT(11) UNSIGNED DEFAULT 0,
    role ENUM('user', 'admin') DEFAULT 'user',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS wallet (
    id CHAR(36) PRIMARY KEY, -- UUID ของ wallet
    user_id CHAR(36) NOT NULL UNIQUE,
    points BIGINT NOT NULL DEFAULT 0, -- จำนวน point ปัจจุบัน
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง history ของ wallet (optional แต่แนะนำ)
CREATE TABLE IF NOT EXISTS wallet_history (
    id CHAR(36) PRIMARY KEY, -- UUID ของรายการ
    wallet_id CHAR(36) NOT NULL,
    change_amount BIGINT NOT NULL, -- เพิ่มเป็นบวก ลดเป็นลบ
    type ENUM('add','subtract') NOT NULL,
    description VARCHAR(255), -- เหตุผลหรือรายละเอียด
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (wallet_id) REFERENCES wallet(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS flags (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    flag_id INT(11) NOT NULL UNIQUE,
    type ENUM('team', 'country') NOT NULL DEFAULT 'country',
    path text NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS matches (
    id INT(11) PRIMARY KEY UNIQUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS match_events (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    match_id INT(11) NOT NULL UNIQUE,
    json JSON NULL,
    status ENUM('NOT STARTED', 'IN PLAY', 'HALF TIME BREAK', 'ADDED TIME', 'FINISHED') DEFAULT 'FINISHED',
    is_updating TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS match_player (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    match_id INT(11) NOT NULL UNIQUE,
    json JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS packages (
    id               CHAR(36) PRIMARY KEY,                -- UUID
    sort_no INT(11) UNSIGNED NOT NULL UNIQUE,
    points            INT UNSIGNED NOT NULL,               -- จำนวนเหรียญ
    price            DECIMAL(10,2) UNSIGNED NOT NULL,              -- ราคาเป็นบาท
    price_per_points   DECIMAL(4,1) UNSIGNED NOT NULL,               -- ราคา/เหรียญ (เช่น 3.3)
    
    published        BOOLEAN NOT NULL DEFAULT TRUE,       -- เผยแพร่หรือไม่
    is_promo         BOOLEAN NOT NULL DEFAULT FALSE,      -- ใช้เป็นโปรหรือไม่
    promo_title      VARCHAR(50) NULL,                    -- เช่น "x3", "พิเศษ", "ผู้ใช้ใหม่"
    note             VARCHAR(255) NULL,                   -- หมายเหตุเพิ่มเติม (ถ้าต้องการ)

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transactions (
    id              CHAR(36) NOT NULL PRIMARY KEY,
    user_id         CHAR(36) NOT NULL,          -- ผู้ใช้งาน
    package_id      CHAR(36) NOT NULL,                 -- อ้างอิงไปยัง packages.uuid
    user_reference  VARCHAR(10) NULL,                -- อ้างอิงผู้ใช้ใส่เอง (เช่นหมายเหตุในสลิปโอนเงิน)
    reference_code  VARCHAR(100) NULL,                 -- รหัสอ้างอิง เช่น เลขที่ธุรกรรมจาก payment gateway
    payment_method  ENUM('bank_transfer', 'credit_card', 'paypal', 'promptpay', 'other') NOT NULL DEFAULT 'bank_transfer',
    amount          DECIMAL(12,2) NOT NULL,            -- ยอดเงินที่ต้องจ่าย
    points          DECIMAL(12) NOT NULL,            -- ยอดเงินที่ต้องจ่าย
    currency        VARCHAR(10) NOT NULL DEFAULT 'THB',-- รองรับหลายสกุลเงินในอนาคต
    status          ENUM('pending', 'awaiting_approval', 'approved', 'rejected', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    slip_url        VARCHAR(255) NULL,                 -- หลักฐานการโอน (ถ้าเป็น manual)
    paid_at         TIMESTAMP NULL,                    -- เวลาที่ชำระเงิน (จริง)
    approved_at     TIMESTAMP NULL,                    -- เวลาที่แอดมินกดอนุมัติ
    expired_at      TIMESTAMP NULL,                    -- เวลาที่แอดมินกดอนุมัติ
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- เผื่อไว้ต่อกับ payment gateway
    gateway         VARCHAR(50) NULL,                  -- เช่น "stripe", "paypal", "omise"
    gateway_txn_id  VARCHAR(100) NULL,                 -- transaction id ของ gateway
    raw_response    JSON NULL,                         -- เก็บ response ดิบจาก gateway

    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_transactions_package FOREIGN KEY (package_id) REFERENCES packages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
