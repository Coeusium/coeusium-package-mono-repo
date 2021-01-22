import { ConnectionInfo, execute } from '@almaclaine/mysql-utils';

function makeId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const len = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * len));
  }
  return result;
}

const createUserTable = `
CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(16) NOT NULL UNIQUE,
    email VARCHAR(320) NOT NULL UNIQUE,
    username VARCHAR(32) NOT NULL UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified TINYINT(1) DEFAULT 0,
    logged_in TINYINT(1) DEFAULT 0,
    PRIMARY KEY(id, email, username)
);`;

const createUserPasswordTable = `
CREATE TABLE IF NOT EXISTS user_password (
    user_id VARCHAR(16) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL UNIQUE,
    PRIMARY KEY(user_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);`;

const createUserLoginTable = `
CREATE TABLE IF NOT EXISTS user_login (
    user_id VARCHAR(16) NOT NULL,
    login_date TIMESTAMP NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);`;

const createUserLogoutTable = `
CREATE TABLE IF NOT EXISTS user_logout (
    user_id VARCHAR(16) NOT NULL,
    logout_date TIMESTAMP NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);`;

const createUserPasswordResetTable = `
CREATE TABLE IF NOT EXISTS user_password_reset (
    user_id VARCHAR(16) NOT NULL,
    token VARCHAR(16) NOT NULL,
    date_requested TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed TINYINT(1) DEFAULT 0,
    PRIMARY KEY(user_id, token),
    FOREIGN KEY (user_id) REFERENCES user(id)
);`;

const createAuthGroupTable = `
CREATE TABLE IF NOT EXISTS auth_group (
    group_name VARCHAR(32) NOT NULL UNIQUE,
    group_parent VARCHAR(32) UNIQUE,
    PRIMARY KEY(group_name, group_parent),
    FOREIGN KEY (group_parent) REFERENCES auth_group(group_name)
);`;

import { readFileSync } from 'fs';

const createNoSelfParentInsertTrigger = readFileSync(
  __dirname + '/test.sql',
  'utf-8',
);

const createNoSelfParentUpdateTrigger = `
DROP TRIGGER IF EXISTS noSelfParentUpdateTrigger;
CREATE Trigger \`noSelfParentUpdateTrigger\` BEFORE Update ON \`auth_group\`
    FOR EACH ROW
    BEGIN
        IF(new.group_name = new.group_parent) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'group_name and group_parent cannot be the same'
        END IF;
    END;`;

const createAuthGroupMembershipTable = `
CREATE TABLE IF NOT EXISTS auth_group_membership (
    user_id VARCHAR(16) NOT NULL,
    group_name VARCHAR(32) NOT NULL UNIQUE,
    PRIMARY KEY(user_id, group_name),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (group_name) REFERENCES auth_group(group_name)
);`;

import { createConnection } from 'mysql2/promise';

export async function setupUserAuthSystem(dbInfo: ConnectionInfo) {
  if (!dbInfo.host) throw new Error('Must provide host name');
  if (!dbInfo.password)
    throw new Error('Must provide password (environment variable recommended)');
  if (!dbInfo.user) throw new Error('Must provide user');

  const database = dbInfo.database || 'sql_user_auth_system';
  await execute(
    { ...dbInfo, database: '' },
    `CREATE DATABASE IF NOT EXISTS ${database};`,
  );

  const conn = await createConnection(dbInfo);

  await conn.query(createNoSelfParentInsertTrigger);

  await execute({ ...dbInfo, database }, createUserTable);
  await execute({ ...dbInfo, database }, createUserPasswordTable);
  await execute({ ...dbInfo, database }, createUserLoginTable);
  await execute({ ...dbInfo, database }, createUserLogoutTable);
  await execute({ ...dbInfo, database }, createUserPasswordResetTable);
  await execute({ ...dbInfo, database }, createAuthGroupTable);
  // await execute({...dbInfo, database}, createNoSelfParentInsertTrigger);
  // await execute({...dbInfo, database}, createNoSelfParentUpdateTrigger);
  // await execute({...dbInfo, database}, createAuthGroupMembershipTable);
  execute.destroyConnections();
}

export async function destroy() {
  execute.destroyConnections();
}

const dbInfo = {
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PW,
  database: 'sql_user_auth_system',
};

(async () => {
  await setupUserAuthSystem(dbInfo);
})();

//
// export async function tagIdExists(dbInfo: ConnectionInfo, id: string) {
//     const sql = `SELECT id FROM tag WHERE id = ? LIMIT 1;`;
//     return (await execute(dbInfo, sql, [id])).length === 1;
// }
//
// export async function addTag(dbInfo: ConnectionInfo, tag: string) {
//     const sql = `INSERT INTO tag (id, tag) VALUES (?, ?);`;
//     let id = makeId();
//     while (await tagIdExists(dbInfo, id)) id = makeId();
//     await execute(dbInfo, sql, [id, tag]);
//     return id;
// }
//
// export async function getTag(dbInfo: ConnectionInfo, id: string) {
//     const sql = `SELECT * FROM tag WHERE id = ? LIMIT 1`;
//     return (await execute(dbInfo, sql, [id]))[0] as Tag || null;
// }
//
// export async function listTags(dbInfo: ConnectionInfo, page = 0, limit = 20) {
//     const sql = `SELECT * FROM tag LIMIT ? OFFSET ?`;
//     const offset = limit * page;
//     return (await execute(dbInfo, sql, [limit, offset])) as Tag[] || [];
// }
//
// export async function deleteTag(dbInfo: ConnectionInfo, id: string) {
//     const sql = `DELETE FROM tag WHERE id=?`;
//     await execute(dbInfo, sql, [id]);
// }
