import * as sqlTagSystem from '../src';

describe('sql-tag-system', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(sqlTagSystem);
        expect(keys.length).toBe(7);
        expect(keys).toMatchSnapshot();
    });
});
