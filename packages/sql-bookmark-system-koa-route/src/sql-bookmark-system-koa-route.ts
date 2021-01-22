import Router from '@koa/router';
import {
  addBookmark,
  deleteBookmark,
  getBookmark,
  listBookmarks,
  bookmarkIdExists,
} from 'sql-bookmark-system';
import compose from 'koa-compose';
import { validateQueryParamsAll } from '@almaclaine/koa-utils';
import { ConnectionInfo } from './types';

export { destroy, setupBookmarkSystem } from 'sql-bookmark-system';

export function createGetBookmarkHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    ctx.body = await getBookmark(dbInfo, id);
  };
}

export function createGetBookmarkListHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { limit, page } = ctx.request.query;
    ctx.body = await listBookmarks(dbInfo, page, limit);
  };
}

export function createBookmarkGetHandler(dbInfo: ConnectionInfo) {
  const getBookmarkHandler = createGetBookmarkHandler(dbInfo);
  const listBookmarkHandler = createGetBookmarkListHandler(dbInfo);
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    if (id) {
      await getBookmarkHandler(ctx, next);
    } else {
      await listBookmarkHandler(ctx, next);
    }
  };
}

export function createPostBookmarkHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { bookmark } = ctx.request.query;
    const id = await addBookmark(dbInfo, bookmark);
    ctx.body = { id };
  };
}

export function createBookmarkDeleteHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    const exists = await bookmarkIdExists(dbInfo, id);
    if (!exists) {
      ctx.status = 412;
      ctx.body = { error: 'No bookmark exists with id ' + id };
      return;
    }

    await deleteBookmark(dbInfo, id);
    ctx.body = {};
  };
}

export function getRouter(dbInfo: ConnectionInfo) {
  const router = new Router();

  const bookmarkGetHandler = createBookmarkGetHandler(dbInfo);
  router.get('/', bookmarkGetHandler);

  const bookmarkDeleteHandler = createBookmarkDeleteHandler(dbInfo);
  router.delete(
    '/',
    compose([validateQueryParamsAll(['id']), bookmarkDeleteHandler]),
  );

  const postBookmarkHandler = createPostBookmarkHandler(dbInfo);
  router.post(
    '/',
    compose([validateQueryParamsAll(['bookmark']), postBookmarkHandler]),
  );

  return router;
}

export function getBookmarkScopedRouter(dbInfo: ConnectionInfo) {
  const router = new Router();
  const routes = getRouter(dbInfo);
  router.use('/bookmark', routes.routes(), routes.allowedMethods());
  return router;
}
