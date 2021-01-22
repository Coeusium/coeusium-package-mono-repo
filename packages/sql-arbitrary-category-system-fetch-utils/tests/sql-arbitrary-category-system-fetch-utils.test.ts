import * as sqlArbitaryTagSystemFetchUtils from '../src';

describe('sql-arbitrary-category-system-fetch-utils', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlArbitaryTagSystemFetchUtils);
    expect(keys.length).toBe(10);
    expect(keys).toMatchSnapshot();
  });
});
