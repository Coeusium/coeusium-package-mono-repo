import {
  ConnectionInfo,
  execute,
  checkExists,
  setupDatabase,
  readSQLTableFiles,
  getOneOrDefault,
  getListOrDefault,
  readQuery,
} from '@almaclaine/mysql-utils';
import { Tag } from './types';
import { makeId } from '@almaclaine/general-utils';

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

const TAG_ID_EXISTS_QUERY = readQuery(__dirname, 'tagIdExists.sql');

export async function tagIdExists(dbInfo: ConnectionInfo, tag_id: string) {
  return checkExists(await execute(dbInfo, TAG_ID_EXISTS_QUERY, [tag_id]));
}

const INSERT_TAG_QUERY = readQuery(__dirname, 'insertTag.sql');

export async function addTag(dbInfo: ConnectionInfo, tag: string) {
  if(tag.includes(',')) throw new Error('Tag may not include comma');
  const checkForTag = await getTagByTag(dbInfo, tag);
  if(checkForTag) return checkForTag.tag_id
  let tag_id = makeId();
  while (await tagIdExists(dbInfo, tag_id)) tag_id = makeId();
  await execute(dbInfo, INSERT_TAG_QUERY, [tag_id, tag]);
  return tag_id;
}

const GET_TAG_BY_ID_QUERY = readQuery(__dirname, 'getTagById.sql');

export async function getTagById(dbInfo: ConnectionInfo, tag_id: string) {
  return getOneOrDefault<Tag>(
    await execute(dbInfo, GET_TAG_BY_ID_QUERY, [tag_id]),
    null,
  );
}

const GET_TAG_BY_TAG_QUERY = readQuery(__dirname, 'getTagByTag.sql');

export async function getTagByTag(dbInfo: ConnectionInfo, tag: string) {
  return getOneOrDefault<Tag>(
      await execute(dbInfo, GET_TAG_BY_TAG_QUERY, [tag]),
      null,
  );
}

const LIST_TAGS_QUERY = readQuery(__dirname, 'listTags.sql');

export async function listTags(dbInfo: ConnectionInfo, page = 0, limit = 20) {
  const offset = `${limit * page}`;
  return getListOrDefault<Tag>(
    await execute(dbInfo, LIST_TAGS_QUERY, [`${limit}`, offset]),
    [],
  );
}

const DELETE_TAG_QUERY = readQuery(__dirname, 'deleteTag.sql');

export async function deleteTag(dbInfo: ConnectionInfo, tag_id: string) {
  await execute(dbInfo, DELETE_TAG_QUERY, [tag_id]);
}
