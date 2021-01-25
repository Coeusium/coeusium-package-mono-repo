import {
  ConnectionInfo,
  deleteFromTableById,
  execute,
  getFromTableById,
  checkExists,
  listFromTable,
  setupDatabase,
  readSQLTableFiles,
  getOneOrDefault,
  getListOrDefault,
} from '@almaclaine/mysql-utils';
import { Tag } from './types';
import { makeId } from '@almaclaine/general-utils';
import { readFileSync } from 'fs';
import { join } from 'path';

const readQuery = (file: string) =>
  readFileSync(join(__dirname, 'sql', 'query', file), 'utf-8');

export async function setupTagSystem(dbInfo: ConnectionInfo) {
  await setupDatabase(
    dbInfo,
    'sql_tag_system',
    await readSQLTableFiles(__dirname),
  );
}

export async function destroy() {
  execute.destroyConnections();
}

const TAG_ID_EXISTS_QUERY = readQuery('tagIdExists.sql');

export async function tagIdExists(dbInfo: ConnectionInfo, id: string) {
  return checkExists(await execute(dbInfo, TAG_ID_EXISTS_QUERY, [id]));
}

const INSERT_TAG_QUERY = readQuery('insertTag.sql');

export async function addTag(dbInfo: ConnectionInfo, tag: string) {
  let id = makeId();
  while (await tagIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, INSERT_TAG_QUERY, [id, tag]);
  return id;
}

const GET_TAG_BY_ID_QUERY = readQuery('getTag.sql');

export async function getTag(dbInfo: ConnectionInfo, id: string) {
  return getOneOrDefault<Tag>(
    await execute(dbInfo, GET_TAG_BY_ID_QUERY, [id]),
    null,
  );
}

const LIST_TAGS_QUERY = readQuery('listTags.sql');

export async function listTags(dbInfo: ConnectionInfo, page = 0, limit = 20) {
  const offset = `${limit * page}`;
  return getListOrDefault<Tag>(
    await execute(dbInfo, LIST_TAGS_QUERY, [`${limit}`, offset]),
    [],
  );
}

const DELETE_TAG_QUERY = readQuery('deleteTag.sql');

export async function deleteTag(dbInfo: ConnectionInfo, id: string) {
  await execute(dbInfo, DELETE_TAG_QUERY, [id]);
}
