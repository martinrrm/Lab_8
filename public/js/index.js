const API_KEY = '2abbf7c3-245b-404f-9473-ade729ed4653'

const tableRow = ({ description, rating, title, url, id }) => `
  <tr>
    <td>${id}</td>
    <td>${title}</td>
    <td><a href="${url}" target="_blank">${url}</a></td>
    <td>${description}</td>
    <td>${rating}</td>
  </tr>
`;

function fetchBookmarks(){
    let bookmarksTable = document.querySelector("#tableBody");

    bookmarksTable.innerHTML = "";
    
    let url = '/bookmarks'
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    }

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error (response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON)
            if (responseJSON.length) {
				responseJSON.forEach((bookmark) => {
					bookmarksTable.innerHTML += tableRow(bookmark);
                });
            }
        })
        .catch(err => {
            console.log(err)
        })
}

function fetchAddBookmark(title, link, description, rating){
    let data = {
        title: title, 
        url: link,
        description: description,
        rating: Number(rating)
    }
    let url = '/bookmarks'
    let settings = {
        method: "POST",
        headers : {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error (response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON)
            fetchBookmarks()
        })
        .catch(err => {
            bookmarksTable.innerHTML = `<div> ${err.message} </div>`;
        })
}

function deleteBookmark(id){
    let url = `/bookmark/${id}`;
    let bookmarksTable = document.querySelector("#tableBody");

    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    }

    fetch(url, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON == ''){
                bookmarksTable.innerHTML = `<div> Bookmark with that ID doesnt exists </div> <button onClick="window.location.reload();">Refetch</button>`;
            } else {
                fetchBookmarks();
            }
        })
        .catch( err => {
            bookmarksTable.innerHTML = `<div> ${err.message} </div>`;
        });
}

function updateBookmark(id, title, description, url, rating){
    let path = `/bookmark/${id}`;
    let bookmarksTable = document.querySelector("#tableBody");

    let data = {
        id: id,
        title: title,
        description: description,
        url: url,
        rating: Number(rating)
    }

    let settings = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify( data )
    }

    fetch(path, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON == ''){
                bookmarksTable.innerHTML = `<div> Bookmark with that ID doesnt exists </div>`;
            }
            fetchBookmarks();
        })
        .catch( err => {
            bookmarksTable.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getBookmark(title){
    let url = `/bookmark?title=${title}`
    let bookmarksTable = document.querySelector("#tableBody");
    bookmarksTable.innerHTML = ''
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
    }

    fetch(url, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON.length){
                responseJSON.forEach((bookmark) => {
                    bookmarksTable.innerHTML += tableRow(bookmark);
                });
            }
            else {
                bookmarksTable.innerHTML = `<div> Bookmark with that title doesnt exists </div> <button onClick="window.location.reload();">Refetch</button>`;
            }
        })
        .catch( err => {
            bookmarksTable.innerHTML = `<div> ${err.message} </div> <button onClick="window.location.reload();">Refetch</button>`;
        });
}

function watchBookmarksForm(){
    fetchBookmarks();
}

function watchPatchBookmarkForm(){
    let bookmarkForm = document.querySelector('.form-patch-bookmark');
    bookmarkForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let id = document.getElementById('bookmarkIdPatch').value
        let title = document.getElementById('bookmarkTitlePatch').value
        let link = document.getElementById('bookmarkUrlPatch').value
        let description = document.getElementById('bookmarkDescriptionPatch').value
        let rating = document.getElementById('bookmarkRatingPatch').value
        updateBookmark(id, title, link, description, rating)
    })
}

function watchDelBookmarkForm(){
    let bookmarkForm = document.querySelector('.form-delete-bookmark');

    bookmarkForm.addEventListener( 'submit', (event) => {
        event.preventDefault();
        console.log("qwerqwe")
        let id = document.getElementById('bookmarkId').value;
        deleteBookmark(id)
    })
}

function watchAddStudentForm(){
    let addBookmark = document.querySelector('.form-add-bookmark');
    addBookmark.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('bookmarkTitle').value
        let link = document.getElementById('bookmarkUrl').value
        let description = document.getElementById('bookmarkDescription').value
        let rating = document.getElementById('bookmarkRating').value
        fetchAddBookmark(title, link, description, rating)
    })
}

function watchGetBookmarkForm(){
    let bookmarkForm = document.querySelector('.form-get-bookmark');
    bookmarkForm.addEventListener( 'submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('bookmarkTitleGet').value;
        getBookmark(title)
    })
}

function init(){
    watchBookmarksForm();
    watchAddStudentForm();
    watchDelBookmarkForm();
    watchPatchBookmarkForm();
    watchGetBookmarkForm();
}

init()

