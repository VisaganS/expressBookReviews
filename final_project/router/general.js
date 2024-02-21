const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const fetchBooks = async () => {
    return books;
}

const findBooksByAuthor = (books, authorName) => {
    let booksByAuthor = [];

    for (let key in books) {
        if (books.hasOwnProperty(key)) {
            if (books[key].author === authorName) {
                booksByAuthor.push(books[key]);
            }
        }
    }

    if (booksByAuthor.length === 0) {
        return "No books by specified author found."
    }

    return booksByAuthor;
}

const findBooksByTitle = (books, titleName) => {
    let booksByTitle = [];

    for (let key in books) {
        if (books.hasOwnProperty(key)) {
            if (books[key].title.toLowerCase().includes(titleName.toLowerCase())) {
                booksByTitle.push(books[key]);
            }
        }
    }
    if(booksByTitle.length === 0){
        return "No books with specified title found."
    }

    return booksByTitle;
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const books = await fetchBooks();
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const books = await fetchBooks();
        const book = books[isbn];

        if (!book) {
            return res.status(400).json("Book not found");
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const books = await fetchBooks();
        return res.status(200).json(findBooksByAuthor(books, req.params.author));

    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }

});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try{
        const books = await fetchBooks();
        return res.status(200).json(findBooksByTitle(books, req.params.title));
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try{
        const books = await fetchBooks();
        return res.status(200).json(books[isbn].reviews);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports.general = public_users;
