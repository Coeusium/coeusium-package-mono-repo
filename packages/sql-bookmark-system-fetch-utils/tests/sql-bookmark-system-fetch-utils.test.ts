import * as sqlBookmarkFetchUtils from '../src';

describe('sql-bookmark-fetch-utils', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlBookmarkFetchUtils);
    expect(keys.length).toBe(4);
    expect(keys).toMatchSnapshot();
  });
});
