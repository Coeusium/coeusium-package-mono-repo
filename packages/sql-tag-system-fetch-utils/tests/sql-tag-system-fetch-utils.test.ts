import * as sqlTagSystemFetchUtils from '../src';

describe('sql-tag-system-fetch-utils', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlTagSystemFetchUtils);
    expect(keys.length).toBe(4);
    expect(keys).toMatchSnapshot();
  });
});
