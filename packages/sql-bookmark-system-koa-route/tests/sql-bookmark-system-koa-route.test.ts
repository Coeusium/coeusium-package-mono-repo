import * as sqlBookmarkSystem from '../src';

describe('sql-bookmark-system-koa-route-test', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlBookmarkSystem);
    expect(keys.length).toBe(9);
    expect(keys).toMatchSnapshot();
  });
});
