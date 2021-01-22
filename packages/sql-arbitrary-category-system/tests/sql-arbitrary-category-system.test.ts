import * as sqlCategorySystem from '../src';

describe('sql-category-system', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlCategorySystem);
    expect(keys.length).toBe(14);
    expect(keys).toMatchSnapshot();
  });
});
