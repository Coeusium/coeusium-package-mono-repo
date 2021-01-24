import * as sqlUserAuthSystem from '../src';

describe('sql-user-auth-system-test', () => {
  it('Has Correct API', () => {
    const keys = Object.keys(sqlUserAuthSystem);
    expect(keys.length).toBe(14);
    expect(keys).toMatchSnapshot();
  });
});
