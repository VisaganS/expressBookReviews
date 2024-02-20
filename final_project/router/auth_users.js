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
    //Get username and find if any reviews made by user.
    // const isbn = req.params.isbn;
    // const review = req.query.review;
    // const username = req.session.username;
    // const book = books[isbn];

    // if (!username) {
    //     return res.status(404).json({ message: "User not found." });
    // }

    // if (!book) {
    //     return res.status(404).json({ message: "Book not found." });
    // }

    // const userReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
    // if (userReviewIndex !== -1) {
    //     // Modify the existing review
    //     books[isbn].reviews[userReviewIndex].review = review;
    //     return res.status(200).json({ message: "Review modified successfully." });
    // } else {
    //     // Add a new review
    //     book.reviews.push({ username, review });
    //     return res.status(200).json({ message: "New review added successfully." });
    // }
    return res.status(300).json({ message: "User Hi" })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
