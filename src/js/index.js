// Global app controller
import Search from './models/Search';
import { elements } from './views/base';
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

    // 4) Search for recipes
    await state.search.getResult();

    // 5) render the results on the UI
    searchView.renderResults(state.search.result);
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
