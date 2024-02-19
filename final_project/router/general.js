const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    function findBooksByAuthor(authorName) {
        let booksByAuthor = [];
    
        for (let key in books) {
            if (books.hasOwnProperty(key)) {
                if (books[key].author === authorName) {
                    booksByAuthor.push(books[key]);
                }
            }
        }
    
        return booksByAuthor;
    }
  return res.status(200).json(findBooksByAuthor(req.params.author));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    function findBooksByTitle(titleName) {
        let booksByTitle = [];
    
        for (let key in books) {
            if (books.hasOwnProperty(key)) {
                if (books[key].title.toLowerCase().includes(titleName.toLowerCase())) {
                    booksByTitle.push(books[key]);
                }
            }
        }
    
        return booksByTitle;
    }
  return res.status(200).json(findBooksByTitle(req.params.title));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
