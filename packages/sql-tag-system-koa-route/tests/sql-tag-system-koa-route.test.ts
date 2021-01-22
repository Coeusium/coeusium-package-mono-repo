import * as sqlTagSystem from '../src';

describe('sql-tag-system-koa-route-test', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlTagSystem);
    expect(keys.length).toBe(9);
    expect(keys).toMatchSnapshot();
  });
});
