import { ConnectionInfo, Bookmark } from './types';
import {
  deleteFromTableById,
  execute,
  getFromTableById,
  idExistsInTable,
  listFromTable,
  setupDatabase,
  readSQLFiles,
} from '@almaclaine/mysql-utils';
import { URL } from 'url';
import { makeId } from '@almaclaine/general-utils';

export async function setupBookmarkSystem(dbInfo: ConnectionInfo) {
  await setupDatabase(dbInfo, 'sql_bookmark_system', await readSQLFiles());
}

export async function destroy() {
  execute.destroyConnections();
}

export async function bookmarkIdExists(dbInfo: ConnectionInfo, id: string) {
  return await idExistsInTable(dbInfo, 'bookmark', id);
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
  return await getFromTableById<Bookmark>(dbInfo, 'bookmark', id);
}

export async function listBookmarks(
  dbInfo: ConnectionInfo,
  page = 0,
  limit = 20,
) {
  return await listFromTable<Bookmark>(dbInfo, 'bookmark', page, limit);
}

export async function deleteBookmark(dbInfo: ConnectionInfo, id: string) {
  await deleteFromTableById(dbInfo, 'bookmark', id);
}
