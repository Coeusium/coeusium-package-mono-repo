import * as sqlBookmarkSystem from '../src';

describe('sql-bookmark-system', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlBookmarkSystem);
    expect(keys.length).toBe(7);
    expect(keys).toMatchSnapshot();
  });
});
