const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "username or password parameter missing." });
});

// Get the book list available in the shop
/*public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});*/

public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4));
    }).then((successMessage) => {
        res.send(successMessage);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        resolve(JSON.stringify(books[isbn]));
    }).then((successMessage) => {
        res.send(successMessage);
    });

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    new Promise((resolve, reject) => {
        let booksByAuthor = Object.keys(books).filter((key) => {
            return books[key].author === author;
        });
        let result = [];
        booksByAuthor.forEach((key) => {
            result.push(books[key]);
        });

        resolve(JSON.stringify(result, null, 4));
    }).then((successMessage) => {
        res.send(successMessage);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    new Promise((resolve, reject) => {

        let booksByTitle = Object.keys(books).filter((key) => {
            return books[key].title === title;
        });
        let result = [];
        booksByTitle.forEach((key) => {
            result.push(books[key]);
        });

        resolve(JSON.stringify(result, null, 4));
    }).then((successMessage) => {
        res.send(successMessage);
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
