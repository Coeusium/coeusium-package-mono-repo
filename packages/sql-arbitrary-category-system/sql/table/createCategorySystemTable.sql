CREATE TABLE IF NOT EXISTS category (
    set_id VARCHAR(16) NOT NULL,
    id VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL,
    parent VARCHAR(16) DEFAULT NULL,
    PRIMARY KEY(id, set_id),
    FOREIGN KEY (set_id) REFERENCES category_set(id) ON DELETE CASCADE,
    FOREIGN KEY (parent) REFERENCES category(id) ON DELETE CASCADE,
    CONSTRAINT CATEGORY_TABLE_categoryIdMustBy16AlphaCharacters CHECK(REGEXP_LIKE (id,'^[A-Za-z]{16}'))
);
