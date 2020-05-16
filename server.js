const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const uuid = require('uuid')
const app = express()
const {API_KEY} = require( './../config' );
const jsonParser = bodyParser.json();
const mongoose = require('mongoose')
const { Bookmark } = require('./models/bookmarkModel')
const {DATABASE_URL, PORT} = require( './config' );

app.use(jsonParser);
app.use( morgan('dev'))
app.use(express.static('public'))

const api = (req, res, next) => {

    // Query verfication
    const { apiKey } = req.query;
    if(apiKey === API_KEY){
        console.log("Auth by Query Param")
        return next();
    }
    
    // Header verification
    const apiKeyHeader = req.headers.api_key
    if(apiKeyHeader === API_KEY){
        console.log("Auth by Header")
        return next();
    }

    // Token verfication
    const token = req.headers.authorization;
    if(!token){
        res.statusMessage = 'The app needs the token'
        return res.status(401).end();
    }

    if( token !== `Bearer ${API_KEY}`) {
        res.statusMessage = ' The authorization token is invalid'
        return res.status(401).end();
    }

    console.log("Auth by Token")
    next();
}

app.use(api);

let bookmarks = [
    {
      id: uuid.v4(),
      title: "Twitch",
      description: "streaming",
      url: "www.twitch.com",
      rating: 1,
    },
    {
      id: uuid.v4(),
      title: "Uuid",
      description: "Uuid",
      url: "https://www.npmjs.com/package/uuid",
      rating: 2,
    },
    {
      id: uuid.v4(),
      title: "Genius",
      description: "Music",
      url: "www.genius.com",
      rating: 3,
    },
    {
      id: uuid.v4(),
      title: "Vitau",
      description: "Trabajo",
      url: "www.vitau.mx",
      rating: 4,
    }
  ];


app.get("/bookmarks", (req, res) => {
    console.log("Request on bookmarks")
    Bookmark
        .getBookmarks()
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err =>{
            res.statusMessage = "Something is wrong with the Database. Try again later."
            return res.status(500).end();
        })
})

app.get("/bookmark", (req, res) => {
    const { title } = req.query;

    // Title not in query
    if (!title) {
        res.statusMessage = "Title query param not found";
        return res.status(406).end();
    }

    Bookmark
        .getBookmark(title)
        .then( result => {
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Title not found.";
            return res.status( 404 ).end();
        });
});

app.post("/bookmarks", (req, res) => {
    console.log(req.body)
    const {title, description, url, rating} = req.body

    if(!title || !description || !url || !rating){
        res.statusMessage = "Fields missing!"
        return res.status(406).end();
    }

    const newPost = {
        id: uuid.v4(),
        title,
        description,
        url,
        rating
    }

    Bookmark
        .createBookmark(newPost)
        .then(result => {
            if(result.errmsg) {
                return res.status(409).end()
            }
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        })
})

app.delete('/bookmark/:id', (req, res) => {
    const { id } = req.params;
    Bookmark
        .delete( id )
        .then( result => {
            if( result.errmsg ){
                res.statusMessage = "Bookmark does not exist.";
                return res.status( 404 ).end();
            }
                return res.status( 200 ).json( result ); 
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        });
})

app.patch('/bookmark/:id', (req, res) => {
    // const {id} = req.body
    if(!req.body.id){
        res.statusMessage = "Id needs to be in the body"
        res.status(406).end();
    }

    const {id} = req.params
    
    if (req.body.id !== id) {
        res.statusMessage = "Param ID and Body ID do not match";
        return res.status(409).end();
    }

    const {title, description, url, rating} = req.body;
    Bookmark
        .patch(id, title, description, url, rating)
        .then( result => {
            if( result.errmsg ){
                res.statusMessage = "Bookmark with that id not found";
                return res.status( 404 ).end();
            }
                return res.status( 202 ).json( result ); 
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        });
})

app.listen(PORT, () => {
    console.log("The server is running!")

    new Promise((resolve, reject) => {
        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };
        mongoose.connect(DATABASE_URL, settings,(err) => {
            if(err) {
                return eject(err);
            }
            else {
                console.log("Database connected succesfully")
                return resolve();
            }
        })
    })
})