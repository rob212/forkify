import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        // good practice to return the item you just added.
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // splice returns the number of items specified in the second param
        // from index of the first element. It also mutates the underlying array to remove 
        // them unlike slice which does not mutate. Therefore we use splice as a delete here 
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        const item = this.items.find(el => el.id === id);
        item.count = newCount;
    }
}