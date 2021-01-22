import { ConnectionInfo, Bookmark } from './types';
import { execute } from '@almaclaine/mysql-utils';
import { URL } from 'url';

function makeId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const len = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * len));
  }
  return result;
}

const createBookmarkTable = `
CREATE TABLE IF NOT EXISTS bookmark (
    id VARCHAR(16) NOT NULL UNIQUE,
    hostname VARCHAR(256) NOT NULL,
    pathname VARCHAR(1024) NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);`;

export async function setupBookmarkSystem(dbInfo: ConnectionInfo) {
  if (!dbInfo.host) throw new Error('Must provide host name');
  if (!dbInfo.password)
    throw new Error('Must provide password (environment variable recommended)');
  if (!dbInfo.user) throw new Error('Must provide user');

  const database = dbInfo.database || 'sql_bookmark_system';
  await execute(
    { ...dbInfo, database: '' },
    `CREATE DATABASE IF NOT EXISTS ${database};`,
  );

  await execute({ ...dbInfo, database }, createBookmarkTable);
  execute.destroyConnections();
}

export async function destroy() {
  execute.destroyConnections();
}

export async function bookmarkIdExists(dbInfo: ConnectionInfo, id: string) {
  const sql = `SELECT id FROM bookmark WHERE id = ? LIMIT 1;`;
  return (await execute(dbInfo, sql, [id])).length === 1;
}

export async function addBookmark(dbInfo: ConnectionInfo, url: string) {
  const sql = `INSERT INTO bookmark (id, hostname, pathname) VALUES (?, ?, ?);`;
  let id = makeId();
  const { hostname, pathname } = new URL(url);
  while (await bookmarkIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, sql, [id, hostname, pathname]);
  return id;
}

export async function getBookmark(dbInfo: ConnectionInfo, id: string) {
  const sql = `SELECT * FROM bookmark WHERE id = ? LIMIT 1`;
  return ((await execute(dbInfo, sql, [id]))[0] as Bookmark) || null;
}

export async function listBookmarks(
  dbInfo: ConnectionInfo,
  page = 0,
  limit = 20,
) {
  const sql = `SELECT * FROM bookmark LIMIT ? OFFSET ?`;
  const offset = limit * page;
  return ((await execute(dbInfo, sql, [limit, offset])) as Bookmark[]) || [];
}

export async function deleteBookmark(dbInfo: ConnectionInfo, id: string) {
  const sql = `DELETE FROM bookmark WHERE id=?`;
  await execute(dbInfo, sql, [id]);
}
