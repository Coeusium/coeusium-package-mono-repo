import {
  ConnectionInfo,
  deleteFromTableById,
  execute,
  getFromTableById,
  idExistsInTable,
  listFromTable,
  setupDatabase,
  readSQLFiles,
} from '@almaclaine/mysql-utils';
import { Tag } from './types';
import { makeId } from '@almaclaine/general-utils';

export async function setupTagSystem(dbInfo: ConnectionInfo) {
  await setupDatabase(dbInfo, 'sql_tag_system', await readSQLFiles());
}

export async function destroy() {
  execute.destroyConnections();
}

export async function tagIdExists(dbInfo: ConnectionInfo, id: string) {
  return idExistsInTable(dbInfo, 'tag', id);
}

export async function addTag(dbInfo: ConnectionInfo, tag: string) {
  const sql = `INSERT INTO tag (id, tag) VALUES (?, ?);`;
  let id = makeId();
  while (await tagIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, sql, [id, tag]);
  return id;
}

export async function getTag(dbInfo: ConnectionInfo, id: string) {
  return getFromTableById<Tag>(dbInfo, 'tag', id);
}

export async function listTags(dbInfo: ConnectionInfo, page = 0, limit = 20) {
  return listFromTable<Tag>(dbInfo, 'tag', page, limit);
}

export async function deleteTag(dbInfo: ConnectionInfo, id: string) {
  return deleteFromTableById(dbInfo, 'tag', id);
}
