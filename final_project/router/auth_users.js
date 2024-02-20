const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req, res) => {
    //retrieve user name and password
    const username = req.body.username;
    const password = req.body.password;
    //check that fields aren't empty
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    //if authenicated user, create a session
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            username: username
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username;
   
    //function declaration to find review of user
    const EditReviewsByUser = (user, isbn) => {
        const book = books[isbn];
        //validate book
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }
        // check if book exists and if it has any reviews
        if (book && Object.keys(book.reviews).length > 0) {
            // check if user has an existing review for book and modify
            if (book.reviews.hasOwnProperty(user)) {
                book.reviews[user] = {review: reviewText};
                books[isbn] = book;
                return res.status(200).json({message: user +" - review has been modified."})
            } 
        } else {
            book.reviews[user] = {review: reviewText};
            books[isbn] = book;
            return res.status(200).json({message: user +" - review has been created."});
        }
    }
    
    //return err if invalid username
    if (!username) {
        return res.status(404).json({ message: "User not found." });
    }
    //return if review query is empty
    if (!reviewText) {
        return res.status(404).json({ message: "Review not found." });
    }
    //find a review made by the user
    EditReviewsByUser(username, isbn);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
