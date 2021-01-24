import {
  ConnectionInfo,
  execute,
  setupDatabase,
  idExistsInTable,
  getFromTableById,
  listFromTable,
  deleteFromTableById,
  readSQLFiles,
} from '@almaclaine/mysql-utils';
import {
  InvalidEmail,
  validateEmail,
  makeId,
  timeNowString,
} from '@almaclaine/general-utils';
import { User } from './types';

export async function setupUserAuthSystem(dbInfo: ConnectionInfo) {
  await setupDatabase(dbInfo, 'sql_user_auth_system', await readSQLFiles());
}

export async function destroy() {
  execute.destroyConnections();
}

export async function userIdExists(dbInfo: ConnectionInfo, id: string) {
  return await idExistsInTable(dbInfo, 'user', id);
}

export async function addUser(
  dbInfo: ConnectionInfo,
  email: string,
  username: string,
) {
  if (!validateEmail(email))
    throw new InvalidEmail('Invalid email address passed to addUser');
  const sql = `INSERT INTO user (id, email, username) VALUES (?, ?, ?);`;
  let id = makeId();
  while (await userIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, sql, [id, email, username]);
  return id;
}

export async function getUserById(dbInfo: ConnectionInfo, id: string) {
  return await getFromTableById<User>(dbInfo, 'user', id);
}

export async function getUserByUsername(
  dbInfo: ConnectionInfo,
  username: string,
) {
  const sql = `SELECT * FROM user WHERE username = ? LIMIT 1`;
  return ((await execute(dbInfo, sql, [username]))[0] as User) || null;
}

export async function getUserByEmail(dbInfo: ConnectionInfo, email: string) {
  const sql = `SELECT * FROM user WHERE email = ? LIMIT 1`;
  return ((await execute(dbInfo, sql, [email]))[0] as User) || null;
}

export async function listUsers(dbInfo: ConnectionInfo, page = 0, limit = 20) {
  return await listFromTable<User>(dbInfo, 'user', page, limit);
}

export async function deleteUserById(dbInfo: ConnectionInfo, id: string) {
  await deleteFromTableById(dbInfo, 'user', id);
}

export async function deleteUserByUsername(
  dbInfo: ConnectionInfo,
  username: string,
) {
  const sql = `DELETE FROM user WHERE username = ?;`;
  await execute(dbInfo, sql, [username]);
}

export async function deleteUserByEmail(dbInfo: ConnectionInfo, email: string) {
  const sql = `DELETE FROM user WHERE email = ?;`;
  await execute(dbInfo, sql, [email]);
}

export async function updateUserEmail(
  dbInfo: ConnectionInfo,
  id: string,
  email: string,
) {
  const sql = `UPDATE user SET email = ? WHERE id = ?;`;
  await execute(dbInfo, sql, [email, id]);
}

export async function updateUserUsername(
  dbInfo: ConnectionInfo,
  id: string,
  username: string,
) {
  const sql = `UPDATE user SET username = ? WHERE id = ?;`;
  await execute(dbInfo, sql, [username, id]);
}

export async function updateUserLastLogin(dbInfo: ConnectionInfo, id: string) {
  const sql = `UPDATE user SET last_login = ? WHERE id = ?;`;
  const login_date = timeNowString();
  return await execute(dbInfo, sql, [login_date, id]);
}

// const dbInfo = {
//     host: 'localhost',
//     user: 'root',
//     database: 'sql_user_auth_system',
//     password: process.env.MYSQL_PW
// };
//
// (async () => {
//     await setupUserAuthSystem(dbInfo);
// })()

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
