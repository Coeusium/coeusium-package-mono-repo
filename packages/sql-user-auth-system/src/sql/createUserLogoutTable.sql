CREATE TABLE IF NOT EXISTS user_logout (
    user_id VARCHAR(16) NOT NULL,
    logout_date TIMESTAMP NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
