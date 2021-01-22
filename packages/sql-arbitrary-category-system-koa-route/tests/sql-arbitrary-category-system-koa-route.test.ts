import * as sqlArbitaryTagSystemKoaRoute from '../src';

describe('sql-arbitrary-category-system-koa-route', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlArbitaryTagSystemKoaRoute);
    expect(keys.length).toBe(17);
    expect(keys).toMatchSnapshot();
  });
});
