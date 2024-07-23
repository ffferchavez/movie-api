/**
 * @fileoverview Mongoose schema definitions and model creations for the application.
 * @requires mongoose
 * @requires bcrypt
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Movie schema definition
/**
 * @typedef {Object} Movie
 * @property {string} Title - The title of the movie.
 * @property {string} Description - A description of the movie.
 * @property {Object} Genre - The genre information of the movie.
 * @property {string} Genre.Name - The name of the genre.
 * @property {string} Genre.Description - A description of the genre.
 * @property {Object} Director - The director information of the movie.
 * @property {string} Director.Name - The name of the director.
 * @property {string} Director.Bio - A biography of the director.
 * @property {Date} Director.Birth - The birth date of the director.
 * @property {Date} Director.Death - The death date of the director (if applicable).
 * @property {string[]} Actors - An array of actor names.
 * @property {string} ImagePath - The path to an image representing the movie.
 * @property {boolean} Featured - Whether the movie is featured or not.
 */
const movieSchema = mongoose.Schema({
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

// User schema definition
/**
 * @typedef {Object} User
 * @property {string} Username - The username of the user.
 * @property {string} Password - The hashed password of the user.
 * @property {string} Email - The email address of the user.
 * @property {Date} Birthday - The birthday of the user.
 * @property {mongoose.Types.ObjectId[]} FavoriteMovies - Array of references to favorite movies.
 */
const userSchema = mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// Hash password middleware
/*
userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("Password")) return next();
  bcrypt.hash(user.Password, 10, function (err, hash) {
    if (err) return next(err);
    user.Password = hash;
    next();
  });
});
*/

/**
 * Hashes a given password using bcrypt.
 *
 * @function
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a given password against the stored hashed password.
 *
 * @function
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, otherwise false.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Models creation
/**
 * @constant {mongoose.Model} Movie - The Movie model based on the movieSchema.
 * @constant {mongoose.Model} User - The User model based on the userSchema.
 */
const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
