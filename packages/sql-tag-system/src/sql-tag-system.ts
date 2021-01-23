import {
  addToTable,
  ConnectionInfo,
  deleteFromTable,
  execute,
  getFromTable,
  idExistsInTable,
  listFromTable,
  setupDatabase,
} from '@almaclaine/mysql-utils';
import { Tag } from './types';

const createTagTable = `
CREATE TABLE IF NOT EXISTS tag (
    id VARCHAR(16) NOT NULL UNIQUE,
    tag VARCHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY(id)
);`;

export async function setupTagSystem(dbInfo: ConnectionInfo) {
  await setupDatabase(dbInfo, 'sql_tag_system', [createTagTable]);
}

export async function destroy() {
  execute.destroyConnections();
}

export async function tagIdExists(dbInfo: ConnectionInfo, id: string) {
  return idExistsInTable(dbInfo, 'tag', id);
}

export async function addTag(dbInfo: ConnectionInfo, tag: string) {
  return addToTable(dbInfo, 'tag', tag);
}

export async function getTag(dbInfo: ConnectionInfo, id: string) {
  return getFromTable<Tag>(dbInfo, 'tag', id);
}

export async function listTags(dbInfo: ConnectionInfo, page = 0, limit = 20) {
  return listFromTable<Tag>(dbInfo, 'tag', page, limit);
}

export async function deleteTag(dbInfo: ConnectionInfo, id: string) {
  return deleteFromTable(dbInfo, 'tag', id);
}
