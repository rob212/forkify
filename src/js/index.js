// Global app controller
import axios from 'axios';

async function getResult(query) {
    try{
        const response = await axios(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
        const recipes = response.data.recipes
        console.log(recipes);
    } catch(error) {
        alert(`Error occured while retrieveing recipes: ${error}`);
    }
}

getResult('pizza');