import { ConnectionInfo, Bookmark } from './types';
import {
  deleteFromTableById,
  execute,
  setupDatabase,
  readSQLTableFiles,
  checkExists,
  getOneOrDefault,
  getListOrDefault,
} from '@almaclaine/mysql-utils';
import { URL } from 'url';
import { makeId } from '@almaclaine/general-utils';
import { readFileSync } from 'fs';
import { join } from 'path';

const readQuery = (file: string) =>
  readFileSync(join(__dirname, 'sql', 'query', file), 'utf-8');

export async function setupBookmarkSystem(dbInfo: ConnectionInfo) {
  await setupDatabase(
    dbInfo,
    'sql_bookmark_system',
    await readSQLTableFiles(__dirname),
  );
}

export async function destroy() {
  execute.destroyConnections();
}

const BOOKMARK_ID_EXISTS_QUERY = readQuery('bookmarkIdExists.sql');

export async function bookmarkIdExists(dbInfo: ConnectionInfo, id: string) {
  return checkExists(await execute(dbInfo, BOOKMARK_ID_EXISTS_QUERY, [id]));
}

const INSERT_BOOKMARK_QUERY = readQuery('insertBookmark.sql');

export async function addBookmark(dbInfo: ConnectionInfo, url: string) {
  let id = makeId();
  const { hostname, pathname } = new URL(url);
  while (await bookmarkIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, INSERT_BOOKMARK_QUERY, [id, hostname, pathname]);
  return id;
}

const GET_BOOKMARK_BY_ID_QUERY = readQuery('getBookmark.sql');

export async function getBookmark(dbInfo: ConnectionInfo, id: string) {
  return getOneOrDefault<Bookmark>(
    await execute(dbInfo, GET_BOOKMARK_BY_ID_QUERY, [id]),
    null,
  );
}

const LIST_BOOKMARKS_QUERY = readQuery('listBookmarks.sql');

export async function listBookmarks(
  dbInfo: ConnectionInfo,
  page = 0,
  limit = 20,
) {
  const offset = `${limit * page}`;
  return getListOrDefault<Bookmark>(
    await execute(dbInfo, LIST_BOOKMARKS_QUERY, [`${limit}`, offset]),
    [],
  );
}

const DELETE_BOOKMARK_QUERY = readQuery('deleteBookmark.sql');

export async function deleteTag(dbInfo: ConnectionInfo, id: string) {
  await execute(dbInfo, DELETE_BOOKMARK_QUERY, [id]);
}
