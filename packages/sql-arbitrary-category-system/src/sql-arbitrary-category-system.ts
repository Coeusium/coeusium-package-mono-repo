import {
  ConnectionInfo,
  execute,
  setupDatabase,
  readSQLTableFiles,
  checkExists,
  getOneOrDefault,
  getListOrDefault,
  readQuery,
} from '@almaclaine/mysql-utils';
import { Category, CategorySet } from './types';
import { makeId } from '@almaclaine/general-utils';

export async function setupCategorySystem(dbInfo: ConnectionInfo) {
  await setupDatabase(
    dbInfo,
    'sql_category_system',
    await readSQLTableFiles(__dirname),
  );
}

export async function destroy() {
  execute.destroyConnections();
}

// Category Set Utilities

const CATEGORY_SET_ID_EXISTS_QUERY = readQuery(
  __dirname,
  'categorySetIdExists.sql',
);

export async function categorySetIdExists(dbInfo: ConnectionInfo, id: string) {
  return checkExists(await execute(dbInfo, CATEGORY_SET_ID_EXISTS_QUERY, [id]));
}

const INSERT_CATEGORY_SET_QUERY = readQuery(__dirname, 'insertCategorySet.sql');

export async function addCategorySet(dbInfo: ConnectionInfo, setName: string) {
  let id = makeId();
  while (await categorySetIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, INSERT_CATEGORY_SET_QUERY, [id, setName]);
  return id;
}

const GET_CATEGORY_SET_BY_ID_QUERY = readQuery(__dirname, 'getCategorySet.sql');

export async function getCategorySet(dbInfo: ConnectionInfo, id: string) {
  return getOneOrDefault<CategorySet>(
    await execute(dbInfo, GET_CATEGORY_SET_BY_ID_QUERY, [id]),
    null,
  );
}

const LIST_CATEGORY_SETS_QUERY = readQuery(__dirname, 'listCategorySets.sql');

export async function listCategorySets(
  dbInfo: ConnectionInfo,
  page = 0,
  limit = 20,
) {
  const offset = `${limit * page}`;
  return getListOrDefault<CategorySet>(
    await execute(dbInfo, LIST_CATEGORY_SETS_QUERY, [`${limit}`, offset]),
    [],
  );
}

const DELETE_CATEGORY_SET_QUERY = readQuery(__dirname, 'deleteCategorySet.sql');

export async function deleteCategorySet(dbInfo: ConnectionInfo, id: string) {
  await execute(dbInfo, DELETE_CATEGORY_SET_QUERY, [id]);
}

// Category Utilities

const CATEGORY_ID_EXISTS_QUERY = readQuery(__dirname, 'categoryIdExists.sql');

export async function categoryIdExists(dbInfo: ConnectionInfo, id: string) {
  return checkExists(await execute(dbInfo, CATEGORY_ID_EXISTS_QUERY, [id]));
}

const INSERT_CATEGORY_QUERY = readQuery(__dirname, 'insertCategory.sql');
const UPDATE_CATEGORY_PARENT_QUERY = readQuery(
  __dirname,
  'updateCategoryParent.sql',
);

export async function addCategory(
  dbInfo: ConnectionInfo,
  categoryName: string,
  setId: string,
  parentId?: string,
) {
  let id = makeId();
  while (await categoryIdExists(dbInfo, id)) id = makeId();
  await execute(dbInfo, INSERT_CATEGORY_QUERY, [setId, id, categoryName]);
  if (parentId && (await categoryIdExists(dbInfo, parentId))) {
    await execute(dbInfo, UPDATE_CATEGORY_PARENT_QUERY, [parentId, id]);
  }
  return id;
}

const GET_CATEGORY_BY_ID_QUERY = readQuery(__dirname, 'getCategory.sql');

export async function getCategory(dbInfo: ConnectionInfo, id: string) {
  return getOneOrDefault<Category>(
    await execute(dbInfo, GET_CATEGORY_BY_ID_QUERY, [id]),
    null,
  );
}

const GET_TOP_LEVEL_CATEGORIES_QUERY = readQuery(
  __dirname,
  'getTopLevelCategories.sql',
);

export async function getTopLevelCategories(
  dbInfo: ConnectionInfo,
  setId: string,
) {
  return getListOrDefault<Category>(
    await execute(dbInfo, GET_TOP_LEVEL_CATEGORIES_QUERY, [setId]),
    [] as Category[],
  );
}

const GET_CATEGORY_CHILDREN_QUERY = readQuery(
  __dirname,
  'getCategoryChildren.sql',
);

export async function getCategoryChildren(dbInfo: ConnectionInfo, id: string) {
  return getListOrDefault<Category>(
    await execute(dbInfo, GET_CATEGORY_CHILDREN_QUERY, [id]),
    [] as Category[],
  );
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

const DELETE_CATEGORY_QUERY = readQuery(__dirname, 'deleteCategory.sql');

export async function deleteCategory(dbInfo: ConnectionInfo, id: string) {
  await execute(dbInfo, DELETE_CATEGORY_QUERY, [id]);
}
