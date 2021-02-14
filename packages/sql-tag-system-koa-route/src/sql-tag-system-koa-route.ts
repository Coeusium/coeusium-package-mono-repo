import Router from '@koa/router';
import {
  addTag,
  deleteTag,
  getTagById,
  listTags,
  tagIdExists,
} from 'sql-tag-system';
import compose from 'koa-compose';
import { validateQueryParamsAll } from '@almaclaine/koa-utils';
import { ConnectionInfo } from './types';

export { destroy, setupTagSystem } from 'sql-tag-system';

export function createGetTagHandler(dbInfo: ConnectionInfo) {
  return async (ctx) => {
    const { tag_id } = ctx.request.query;
    ctx.body = await getTagById(dbInfo, tag_id);
  };
}

export function createGetTagListHandler(dbInfo: ConnectionInfo) {
  return async (ctx) => {
    const { limit, page } = ctx.request.query;
    ctx.body = await listTags(dbInfo, page, limit);
  };
}

export function createTagGetHandler(dbInfo: ConnectionInfo) {
  const getTagHandler = createGetTagHandler(dbInfo);
  const listTagHandler = createGetTagListHandler(dbInfo);
  return async (ctx) => {
    const { tag_id } = ctx.request.query;
    if (tag_id) {
      await getTagHandler(ctx);
    } else {
      await listTagHandler(ctx);
    }
  };
}

export function createPostTagHandler(dbInfo: ConnectionInfo) {
  return async (ctx) => {
    const { tag } = ctx.request.query;
    let out = [];

    if(tag.includes(',')) {
      const tags = tag.split(',');
      out = await Promise.all(tags.map(e => addTag(dbInfo, e)));
    } else {
      const tag_id = await addTag(dbInfo, tag);
      out.push(tag_id);
    }
    ctx.body = out;
  };
}

export function createTagDeleteHandler(dbInfo: ConnectionInfo) {
  return async (ctx) => {
    const { tag_id } = ctx.request.query;
    const exists = await tagIdExists(dbInfo, tag_id);
    if (!exists) {
      ctx.status = 412;
      ctx.body = { error: 'No tag exists with tag_id ' + tag_id };
      return;
    }

    await deleteTag(dbInfo, tag_id);
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
    compose([validateQueryParamsAll(['tag_id']), tagDeleteHandler]),
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
