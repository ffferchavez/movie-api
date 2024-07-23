/**
 * @fileoverview This file is the main entry point for the myFlix API server.
 * It sets up the express server, connects to the MongoDB database, and defines the various API endpoints.
 */

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const Models = require("./models.js");
const { check, validationResult } = require("express-validator");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(morgan("combined")); // Logging middleware

// MongoDB local connection

/*mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

const Movies = Models.Movie;
const Users = Models.User;

// Auth middleware
require("./auth")(app);

// Routes

/**
 * Root endpoint
 * @name GetRoot
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {string} Welcome message
 */
app.get("/", (req, res) => {
  res.send("Hi, Welcome to my Marvel Movies App!");
});

/**
 * Get all movies
 * @name GetMovies
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} List of all movies
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(400).send("Error: " + err);
      });
  }
);

/**
 * Get a movie by title
 * @name GetMovie
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Movie details
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.status(200).json(movie);
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get a genre by name
 * @name GetGenre
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Genre details
 */
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.status(200).json(movie.Genre);
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get a director by name
 * @name GetDirector
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Director details
 */
app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Register a new user
 * @name RegisterUser
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} New user details
 */
app.post(
  "/users",
  [
    check(
      "Username",
      "Username is required and must be at least 5 characters long"
    ).isLength({ min: 5 }),
    check("Username", "Username must be alphanumeric").isAlphanumeric(),
    check(
      "Password",
      "Password is required and must be at least 6 characters long"
    ).isLength({ min: 6 }),
    check("Email", "Email does not appear to be valid.").isEmail(),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Update user info
 * @name UpdateUser
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Updated user details
 */
app.put(
  "/users/:id",
  [
    check("Username", "Username is required").optional().isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    )
      .optional()
      .isAlphanumeric(),
    check("Password", "Password must have at least 6 characters")
      .optional()
      .isLength({ min: 6 }),
    check("Email", "Email does not appear to be valid").optional().isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // Check if current user is authorized to update
      if (req.user._id !== req.params.id) {
        return res.status(403).send("Permission denied");
      }

      // Hash password if provided
      let hashedPassword;
      if (req.body.Password) {
        hashedPassword = Users.hashPassword(req.body.Password);
      }

      // Find user by ID and update
      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Error updating user");
    }
  }
);

/**
 * Add a movie to user's favorites
 * @name AddFavoriteMovie
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Updated user details with favorite movies
 */
app.post(
  "/users/:id/favorites/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { FavoriteMovies: req.params.movieId } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("User not found");
        }
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Remove a movie from user's favorites
 * @name RemoveFavoriteMovie
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Updated user details with favorite movies
 */
app.delete(
  "/users/:id/favorites/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { FavoriteMovies: req.params.movieId } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("User not found");
        }
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Delete a user account
 * @name DeleteUser
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {string} Success message
 */
app.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Check if current user is authorized to delete
      if (req.user._id !== req.params.id) {
        return res.status(403).send("Permission denied");
      }

      const deletedUser = await Users.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Error deleting user");
    }
  }
);

/**
 * Error handler middleware
 * @name ErrorHandler
 * @function
 * @memberof module:routes
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
