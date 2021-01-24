CREATE TABLE IF NOT EXISTS bookmark (
    id VARCHAR(16) NOT NULL UNIQUE,
    hostname VARCHAR(256) NOT NULL,
    pathname VARCHAR(1024) NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT BOOKMARK_TABLE_tagIdMustBy16AlphaCharacters CHECK(REGEXP_LIKE (id,'^[A-Za-z]{16}')),
    CONSTRAINT BOOKMARK_TABLE_hostnameMustBeValidHostname CHECK(REGEXP_LIKE (hostname,'^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$'))
);
