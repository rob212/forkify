// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoadingSpinner, clearLoadingSpinner } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/**
 * Global state of the app
 * - Search object 
 * - Current recipe object 
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 *  SEARCH CONTROLLER
 */ 
const controlSearch = async () => {
    // 1) get the query from the view
    const query =  searchView.getInput();

    if (query) {
        // 2) New search object and add it to state
        state.search = new Search(query);
    } 

    // 3) Prepare the UI for results
    searchView.clearInput();
    searchView.clearPreviousResults();
    renderLoadingSpinner(elements.searchResultPanel);
    

    // 4) Search for recipes
    try {

        await state.search.getResult();
        
        // 5) render the results on the UI
        clearLoadingSpinner();
        searchView.renderResults(state.search.result);
    } catch (error) {
        alert(`Something went wrong with the search... ${error}`);
        clearLoadingSpinner();
    }
}

elements.searchForm.addEventListener('submit', el => {
    el.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', el => {
    const button = el.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearPreviousResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/**
 *  RECIPE CONTROLLER
 */ 
const controlRecipe = async () => {
    // Get id from the url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // prepare the UI for changes
        recipeView.clearRecipe();
        renderLoadingSpinner(elements.recipe);

        // highlight selected search item
        if (state.search) searchView.highlightedSelected(id);
        
        // Create a new Recipe object 
        state.recipe = new Recipe(id);

        // Get the recipe data and parse ingredients
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            
            // Render the recipe
            clearLoadingSpinner();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            alert(`Error processing recipe: ${error}`);
        }
    }
};

// Add event listener for page load and URL hash change 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));