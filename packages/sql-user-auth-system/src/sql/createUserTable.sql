CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(16) NOT NULL UNIQUE,
    email VARCHAR(320) NOT NULL UNIQUE,
    username VARCHAR(32) NOT NULL UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified TINYINT(1) DEFAULT 0,
    logged_in TINYINT(1) DEFAULT 0,
    PRIMARY KEY(id, email, username),
    CONSTRAINT USER_TABLE_userIdMustBy16AlphaCharacters CHECK(REGEXP_LIKE (id,'^[A-Za-z]{16}')),cd
    CONSTRAINT USER_TABLE_emailMustBeValidEmail CHECK(REGEXP_LIKE (email,'^[A-Za-z]+[A-Za-z0-9.]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')),
    CONSTRAINT USER_TABLE_userNameMustStartWithAlpha CHECK(REGEXP_LIKE (username,'^[A-Za-z]+[A-Za-z0-9.]+'))
);
