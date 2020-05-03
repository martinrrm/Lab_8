const mongoose = require('mongoose')

const bookmarkSchema = mongoose.Schema({
    id: { 
        type: String, 
        required: true
    },
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
})

const bookmarkCollection = mongoose.model('bookmarksdb', bookmarkSchema);

const Bookmark = {
    createBookmark: function(newBookmark){
        return bookmarkCollection
                .create(newBookmark)
                .then(bookmark => {
                    return bookmark
                })
                .catch( err => {
                    return err
                })
    },
    getBookmarks : function() {
        return bookmarkCollection
                .find()
                .then( allBookmarks =>{
                    return allBookmarks;
                })
                .catch( err => {
                    return err;
                });
    },
    getBookmark : function(title){
        return bookmarkCollection
                .find({"title": title})
                .then( bookmarks => {
                    return bookmarks;
                })
                .catch( err => {
                    return err;
                });
    },
    delete : function(id){
        return bookmarkCollection
                .deleteOne({"id" : id})
                .then( result => {
                    if (result.n == 0)
                            return false
                        else
                            return true
                })
                .catch( err => {
                    return err;
                });
    },
    patch : function(id, title, description, url, rating ){
        return bookmarkCollection
                .updateOne({"id": id}, {"title": title, "description": description, "url" : url, "rating": rating})
                .then( result => {
                    if (result.n == 0)
                            return false
                        else
                            return true
                })
                .catch(err => {
                    return err;
                })
    }
}

module.exports = { Bookmark };