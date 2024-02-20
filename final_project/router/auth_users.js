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
    const username = req.session.username;
    const reviewText = req.query.review;
    //function declaration to find review of user
    const findReviewsByUser = (user, isbn) => {
        const book = books[isbn];
        
        // check if Book 1 exists and if it has any reviews
        if (book && Object.keys(book.reviews).length > 0) {
            // check if user has made a review for Book 1
            if (book.reviews.hasOwnProperty(user)) {
                return book.reviews[user].review;
            } else {
                return "User has not made a review for " + book.title;
            }
        } else {
            return "Book has no reviews or doesn't exist ";
        }
    }
    
    //return err if invalid username
    if (!username) {
        return res.status(404).json({ message: "User not found." });
    }
    //return if review query is empty
    if (!review) {
        return res.status(404).json({ message: "Review not found." });
    }
    //find a review made by the user
    findReviewsByUser(username, isbn)
    if (reviewLocation !== -1) {
        //update existing review
        books[isbn].reviews[reviewLocation].push(newReview);
        return res.status(200).json({ message: "Review modified successfully." });
    } else {
        // Add a new review
        book.reviews.push({ username, review });
        return res.status(200).json({ message: "New review added successfully." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
