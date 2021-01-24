CREATE TABLE IF NOT EXISTS user_password (
    user_id VARCHAR(16) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL UNIQUE,
    PRIMARY KEY(user_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);`
