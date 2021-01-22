import Router from '@koa/router';
import {
  addTag,
  deleteTag,
  getTag,
  listTags,
  tagIdExists,
} from 'sql-tag-system';
import compose from 'koa-compose';
import { validateQueryParamsAll } from '@almaclaine/koa-utils';
import { ConnectionInfo } from './types';

export { destroy, setupTagSystem } from 'sql-tag-system';

export function createGetTagHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    ctx.body = await getTag(dbInfo, id);
  };
}

export function createGetTagListHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { limit, page } = ctx.request.query;
    ctx.body = await listTags(dbInfo, page, limit);
  };
}

export function createTagGetHandler(dbInfo: ConnectionInfo) {
  const getTagHandler = createGetTagHandler(dbInfo);
  const listTagHandler = createGetTagListHandler(dbInfo);
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    if (id) {
      await getTagHandler(ctx, next);
    } else {
      await listTagHandler(ctx, next);
    }
  };
}

export function createPostTagHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { tag } = ctx.request.query;
    const id = await addTag(dbInfo, tag);
    ctx.body = { id };
  };
}

export function createTagDeleteHandler(dbInfo: ConnectionInfo) {
  return async (ctx, next) => {
    const { id } = ctx.request.query;
    const exists = await tagIdExists(dbInfo, id);
    if (!exists) {
      ctx.status = 412;
      ctx.body = { error: 'No tag exists with id ' + id };
      return;
    }

    await deleteTag(dbInfo, id);
    ctx.body = {};
  };
}

export function getRouter(dbInfo: ConnectionInfo) {
  const router = new Router();

  const tagGetHandler = createTagGetHandler(dbInfo);
  router.get('/', tagGetHandler);

  const tagDeleteHandler = createTagDeleteHandler(dbInfo);
  router.delete(
    '/',
    compose([validateQueryParamsAll(['id']), tagDeleteHandler]),
  );

  const postTagHandler = createPostTagHandler(dbInfo);
  router.post('/', compose([validateQueryParamsAll(['tag']), postTagHandler]));

  return router;
}

export function getTagScopedRouter(dbInfo: ConnectionInfo) {
  const router = new Router();
  const routes = getRouter(dbInfo);
  router.use('/tag', routes.routes(), routes.allowedMethods());
  return router;
}
