CREATE TABLE IF NOT EXISTS user_password_reset (
    user_id VARCHAR(16) NOT NULL,
    token VARCHAR(16) NOT NULL,
    date_requested TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed TINYINT(1) DEFAULT 0,
    PRIMARY KEY(user_id, token),
    FOREIGN KEY (user_id) REFERENCES user(id),
    CONSTRAINT USER_PASSWORD_RESET_TABLE_tokenMustBy16AlphaCharacters CHECK(REGEXP_LIKE (token,'^[A-Za-z]{16}'))
);
