export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        }
        this.likes.push(like);

        // Persist the data in localStorage
        this.persistData();
        return like;
    };

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
         // Persist the data removal in localStorage
         this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    };

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        // we can only use Strings so use JSON Stringify
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        // JSON parse is the opposite of JSON.Stringify
        const storage = JSON.parse(localStorage.getItem('likes'));

        // restore the likes from the local storage incase browser has been refreshed
        if (storage) this.likes = storage;
    }
}