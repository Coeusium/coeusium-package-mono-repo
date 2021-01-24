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
import { Category, CategorySet } from './types';
import { makeId } from '@almaclaine/general-utils';

export async function setupCategorySystem(dbInfo: ConnectionInfo) {
  await setupDatabase(dbInfo, 'sql_category_system', await readSQLFiles());
}

export async function destroy() {
  execute.destroyConnections();
}

// Category Set Utilities

export async function categorySetIdExists(dbInfo: ConnectionInfo, id: string) {
  return await idExistsInTable(dbInfo, 'category_set', id);
}

export async function addCategorySet(dbInfo: ConnectionInfo, setName: string) {
  const sql = `INSERT INTO category_set (id, name) VALUES (?, ?);`;
  let id = makeId();
  while (await categorySetIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, sql, [id, setName]);
  return id;
}

export async function getCategorySet(dbInfo: ConnectionInfo, id: string) {
  return await getFromTableById<CategorySet>(dbInfo, 'category_set', id);
}

export async function listCategorySets(
  dbInfo: ConnectionInfo,
  page = 0,
  limit = 20,
) {
  return await listFromTable<CategorySet>(dbInfo, 'category_set', page, limit);
}

export async function deleteCategorySet(dbInfo: ConnectionInfo, id: string) {
  await deleteFromTableById(dbInfo, 'category_set', id);
}

// Category Utilities

export async function categoryIdExists(dbInfo: ConnectionInfo, id: string) {
  return await idExistsInTable(dbInfo, 'category', id);
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
  return await getFromTableById<Category>(dbInfo, 'category', id);
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
  await deleteFromTableById(dbInfo, 'category', id);
}
