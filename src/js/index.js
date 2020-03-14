// Global app controller
import Search from './models/Search';
import { elements, renderLoadingSpinner, clearLoadingSpinner } from './views/base';
import * as searchView from './views/searchView';

/**
 * Global state of the app
 * - Search object 
 * - Current recipe object 
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

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
    await state.search.getResult();

    // 5) render the results on the UI
    clearLoadingSpinner();
    searchView.renderResults(state.search.result);
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

