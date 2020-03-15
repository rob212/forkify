import { formatCount }  from './recipeView';

describe('resultView formatCount', () => {

    test('returns 1/2 when given 0.5', () => {
        expect(formatCount(0.5)).toEqual('1/2');
    });

    test('returns 2 1/2 when given 2.5', () => {
        expect(formatCount(2.5)).toEqual('2 1/2');
    });

    test('returns ? when given undefined', () => {
        expect(formatCount(undefined)).toEqual('?');
    });

});