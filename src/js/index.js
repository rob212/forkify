// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, renderLoadingSpinner, clearLoadingSpinner } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Likes from './models/Likes';

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
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(id)
            );

        } catch (error) {
            alert(`Error processing recipe: ${error}`);
        }
    }
};

/**
 *  LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list if one doesn't already exist
    if (!state.list) state.list = new List();

    // Add each ingrdiet from the recipe into the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete being clicked
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from the state 
        state.list.deleteItem(id);

        // Delete from the UI
        listView.deleteItem(id);

    // Handle the servings update in shopping list
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});



/**
 * LIKES CONTROLLER 
 */
// testing only temp
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentId)) {
        // Add like to the state 
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );

        // Toggle the like button 
        likesView.toggleLikesBtn(true);

        // Add like to UI list
        likesView.renderLikeMenu(newLike);

    // User has already liked the current recipe
    } else {
         // Remove like to the state 
         state.likes.deleteLike(currentId);

        // Toggle the like button 
        likesView.toggleLikesBtn(false);

        // Remove like to UI list
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


 /**
  * EVENT HANDLERS 
  */

// Add event listener for page load and URL hash change 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling Recipe serving button clicks or like button using matches event listener 
elements.recipe.addEventListener('click', e => {
    // true if btn decrease or any of its children are clicked e.g. text on the button
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease serving button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase serving button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Add recipe to Likes
        controlLike();
    }
});
