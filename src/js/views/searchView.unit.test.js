import * as searchView from './searchView';

describe('Search View ', () => {
    describe('limitRecipeTitle', () => {
        
        test('should return title as is if less than 17 characters in length', () => {
            expect(searchView.limitRecipeTitle('Choc cake')).toBe('Choc cake');    
        });
        
        test("should return title if it is exactly 17 characters in length", () => {
          expect(searchView.limitRecipeTitle("Cheesey Mushrooms")).toBe(
            "Cheesey Mushrooms"
          );
        });

        test("should return shortened title when greater than 17 characters in length without breaking word", () => {
          expect(searchView.limitRecipeTitle("Extra spicy chilli soup")).toBe(
            "Extra spicy chilli ..."
          );
        });

    });
});