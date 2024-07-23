/**
 * @fileoverview This file defines the Mongoose schemas and models for the myFlix application.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Mongoose schema for movies
 * @constructor Movie
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Date,
    Death: Date,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * Mongoose schema for users
 * @constructor User
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * Hashes a password using bcrypt
 * @function hashPassword
 * @memberof module:models.User
 * @param {string} password - The password to hash
 * @returns {string} Hashed password
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a password
 * @function validatePassword
 * @memberof module:models.User
 * @param {string} password - The password to validate
 * @returns {boolean} True if the password is valid, false otherwise
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
