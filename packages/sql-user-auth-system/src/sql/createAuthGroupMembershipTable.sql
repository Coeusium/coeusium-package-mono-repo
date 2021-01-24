CREATE TABLE IF NOT EXISTS auth_group_membership (
    user_id VARCHAR(16) NOT NULL,
    group_name VARCHAR(32) NOT NULL UNIQUE,
    PRIMARY KEY(user_id, group_name),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (group_name) REFERENCES auth_group(group_name)
);
