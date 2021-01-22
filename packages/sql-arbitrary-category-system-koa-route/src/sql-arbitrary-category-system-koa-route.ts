import Router from '@koa/router';
import compose from 'koa-compose';
import { validateQueryParamsAll } from '@almaclaine/koa-utils';
import { ConnectionInfo } from './types';
import {
  addCategory,
  addCategorySet,
  categoryIdExists,
  categorySetIdExists,
  deleteCategory,
  deleteCategorySet,
  getCategory,
  getCategoryChildren,
  getCategoryDescendants,
  getCategorySet,
  getTopLevelCategories,
  listCategorySets,
} from 'sql-arbitrary-category-system';

export { destroy, setupCategorySystem } from 'sql-arbitrary-category-system';

// Category Set Handlers

export function createGetCategorySetHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    ctx.body = await getCategorySet(dbInfo, id);
  };
}

export function createGetCategorySetListHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { limit, page } = ctx.request.query;
    ctx.body = await listCategorySets(dbInfo, page, limit);
  };
}

export function createCategorySetGetHandler(dbInfo: ConnectionInfo) {
  const getCategorySetHandler = createGetCategorySetHandler(dbInfo);
  const listCategorySetHandler = createGetCategorySetListHandler(dbInfo);
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    if (id) {
      await getCategorySetHandler(ctx, next);
    } else {
      await listCategorySetHandler(ctx, next);
    }
  };
}

export function createPostCategorySetHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { name } = ctx.request.query;
    const id = await addCategorySet(dbInfo, name);
    ctx.body = { id };
  };
}

export function createCategorySetDeleteHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    const exists = await categorySetIdExists(dbInfo, id);
    if (!exists) {
      ctx.status = 412;
      ctx.body = { error: 'No category set exists with id ' + id };
      return;
    }

    await deleteCategorySet(dbInfo, id);
    ctx.body = {};
  };
}

export function getCategorySetRouter(dbInfo: ConnectionInfo) {
  const router = new Router();

  const tagGetHandler = createCategorySetGetHandler(dbInfo);
  router.get('/', tagGetHandler);

  const tagDeleteHandler = createCategorySetDeleteHandler(dbInfo);
  router.delete(
    '/',
    compose([validateQueryParamsAll(['id']), tagDeleteHandler]),
  );

  const postTagHandler = createPostCategorySetHandler(dbInfo);
  router.post('/', compose([validateQueryParamsAll(['name']), postTagHandler]));

  return router;
}

// Category Handlers

export function createGetCategoryHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    ctx.body = await getCategory(dbInfo, id);
  };
}

export function createGetTopLevelCategoriesHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    ctx.body = await getTopLevelCategories(dbInfo, id);
  };
}

export function createGetCategoryChildrenHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    ctx.body = await getCategoryChildren(dbInfo, id);
  };
}

export function createGetCategoryDescendantsHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    ctx.body = await getCategoryDescendants(dbInfo, id);
  };
}

export function createCategoryGetHandler(dbInfo: ConnectionInfo) {
  const getCategoryHandler = createGetCategoryHandler(dbInfo);
  const getCategoryChildrenHandler = createGetCategoryChildrenHandler(dbInfo);
  const getCategoryDescendantsHandler = createGetCategoryDescendantsHandler(
    dbInfo,
  );
  const getTopLevelCategoriesHandler = createGetTopLevelCategoriesHandler(
    dbInfo,
  );
  return async (ctx, next) => {
    const { type } = ctx.request.query;
    if (type === 'children') {
      await getCategoryChildrenHandler(ctx, next);
    } else if (type === 'descendants') {
      await getCategoryDescendantsHandler(ctx, next);
    } else if (type === 'top') {
      await getTopLevelCategoriesHandler(ctx, next);
    } else {
      await getCategoryHandler(ctx, next);
    }
  };
}

export function createPostCategoryHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { name, set_id, parent } = ctx.request.query;
    const id = await addCategory(dbInfo, name, set_id, parent);
    ctx.body = { id };
  };
}

export function createCategoryDeleteHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    const exists = await categoryIdExists(dbInfo, id);
    if (!exists) {
      ctx.status = 412;
      ctx.body = { error: 'No category exists with id ' + id };
      return;
    }

    await deleteCategory(dbInfo, id);
    ctx.body = {};
  };
}

export function getCategoryRouter(dbInfo: ConnectionInfo) {
  const router = new Router();

  const tagGetHandler = createCategoryGetHandler(dbInfo);
  router.get('/', compose([validateQueryParamsAll(['id']), tagGetHandler]));

  const tagDeleteHandler = createCategoryDeleteHandler(dbInfo);
  router.delete(
    '/',
    compose([validateQueryParamsAll(['id']), tagDeleteHandler]),
  );

  const postTagHandler = createPostCategoryHandler(dbInfo);
  router.post(
    '/',
    compose([validateQueryParamsAll(['name', 'set_id']), postTagHandler]),
  );

  return router;
}

export function getScopedRouter(dbInfo: ConnectionInfo) {
  const catRouter = new Router();
  const catRoutes = getCategoryRouter(dbInfo);

  const router = new Router();
  const setRoutes = getCategorySetRouter(dbInfo);
  router.use('/', catRoutes.routes(), catRoutes.allowedMethods());
  router.use('/set', setRoutes.routes(), setRoutes.allowedMethods());

  catRouter.use('/category', router.routes(), router.allowedMethods());

  return catRouter;
}
