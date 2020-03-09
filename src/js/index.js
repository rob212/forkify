// Global app controller
import Search from './models/Search';

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
    const query = 'pizza' //Todo

    if (query) {
        // 2) New search object and add it to state
        state.search = new Search(query);
    } 

    // 3) Prepare the UI for results

    // 4) Search for recipes
    await state.search.getResult();

    // 5) render the results on the UI
    console.log(state.search.result);
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
