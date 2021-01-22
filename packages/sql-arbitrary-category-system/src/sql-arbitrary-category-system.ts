import { ConnectionInfo, execute } from '@almaclaine/mysql-utils';
import { Category, CategorySet } from './types';

function makeId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const len = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * len));
  }
  return result;
}

const createCategorySetTable = `
CREATE TABLE IF NOT EXISTS category_set (
    id VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY(id)
);`;

const createCategorySystemTable = `
CREATE TABLE IF NOT EXISTS category (
    set_id VARCHAR(16) NOT NULL,
    id VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL,
    parent VARCHAR(16) DEFAULT NULL,
    PRIMARY KEY(id, set_id),
    FOREIGN KEY (set_id) REFERENCES category_set(id) ON DELETE CASCADE,
    FOREIGN KEY (parent) REFERENCES category(id) ON DELETE CASCADE
);`;

export async function setupCategorySystem(dbInfo: ConnectionInfo) {
  if (!dbInfo.host) throw new Error('Must provide host name');
  if (!dbInfo.password)
    throw new Error('Must provide password (environment variable recommended)');
  if (!dbInfo.user) throw new Error('Must provide user');

  const database = dbInfo.database || 'sql_category_system';
  await execute(
    { ...dbInfo, database: '' },
    `CREATE DATABASE IF NOT EXISTS ${database};`,
  );

  await execute({ ...dbInfo, database }, createCategorySetTable);
  await execute({ ...dbInfo, database }, createCategorySystemTable);
  execute.destroyConnections();
}

export async function destroy() {
  execute.destroyConnections();
}

// Category Set Utilities

export async function categorySetIdExists(dbInfo: ConnectionInfo, id: string) {
  const sql = `SELECT id FROM category_set WHERE id = ? LIMIT 1;`;
  return (await execute(dbInfo, sql, [id])).length === 1;
}

export async function addCategorySet(dbInfo: ConnectionInfo, setName: string) {
  const sql = `INSERT INTO category_set (id, name) VALUES (?, ?);`;
  let id = makeId();
  while (await categorySetIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, sql, [id, setName]);
  return id;
}

export async function getCategorySet(dbInfo: ConnectionInfo, id: string) {
  const sql = `SELECT * FROM category_set WHERE id = ? LIMIT 1`;
  return ((await execute(dbInfo, sql, [id]))[0] as CategorySet) || null;
}

export async function listCategorySets(
  dbInfo: ConnectionInfo,
  page = 0,
  limit = 20,
) {
  const sql = `SELECT * FROM category_set LIMIT ? OFFSET ?`;
  const offset = limit * page;
  return ((await execute(dbInfo, sql, [limit, offset])) as CategorySet[]) || [];
}

export async function deleteCategorySet(dbInfo: ConnectionInfo, id: string) {
  const sql = `DELETE FROM category_set WHERE id=?`;
  await execute(dbInfo, sql, [id]);
}

// Category Utilities

export async function categoryIdExists(dbInfo: ConnectionInfo, id: string) {
  const sql = `SELECT id FROM category WHERE id = ? LIMIT 1;`;
  return (await execute(dbInfo, sql, [id])).length === 1;
}

export async function addCategory(
  dbInfo: ConnectionInfo,
  categoryName: string,
  setId: string,
  parentId?: string,
) {
  const sql = `INSERT INTO category (set_id, id, name) VALUES (?, ?, ?);`;
  let id = makeId();
  while (await categoryIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, sql, [setId, id, categoryName]);
  if (parentId && (await categoryIdExists(dbInfo, parentId))) {
    const sql2 = `UPDATE category SET parent = ? WHERE id = ?;`;
    await execute(dbInfo, sql2, [parentId, id]);
  }
  return id;
}

export async function getCategory(dbInfo: ConnectionInfo, id: string) {
  const sql = `SELECT * FROM category WHERE id = ? LIMIT 1`;
  return ((await execute(dbInfo, sql, [id]))[0] as Category) || null;
}

export async function getTopLevelCategories(
  dbInfo: ConnectionInfo,
  setId: string,
) {
  const sql = `SELECT * FROM category WHERE set_id = ? AND parent IS NULL;`;
  return ((await execute(dbInfo, sql, [setId])) as Category[]) || [];
}

export async function getCategoryChildren(dbInfo: ConnectionInfo, id: string) {
  const sql = `SELECT * FROM category WHERE parent = ?;`;
  return ((await execute(dbInfo, sql, [id])) as Category[]) || [];
}

export async function getCategoryDescendants(
  dbInfo: ConnectionInfo,
  id: string,
) {
  const children = await getCategoryChildren(dbInfo, id);
  const rest = (
    await Promise.all(
      children.map(
        async ({ id: childId }) =>
          await getCategoryDescendants(dbInfo, childId),
      ),
    )
  ).reduce((a, c) => a.concat(c), []);
  return [...children, ...rest];
}

export async function deleteCategory(dbInfo: ConnectionInfo, id: string) {
  const sql = `DELETE FROM category WHERE id=?`;
  await execute(dbInfo, sql, [id]);
}
