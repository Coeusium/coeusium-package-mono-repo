CREATE TABLE IF NOT EXISTS auth_group (
    group_name VARCHAR(32) NOT NULL UNIQUE,
    group_parent VARCHAR(32) UNIQUE DEFAULT NULL,
    PRIMARY KEY(group_name),
    FOREIGN KEY (group_parent) REFERENCES auth_group(group_name),
    CONSTRAINT GroupParentUnequal CHECK (group_name != group_parent)
);
