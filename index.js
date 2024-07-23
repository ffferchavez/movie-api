/**
 * @fileoverview Main entry point for the Express application.
 * @requires express
 * @requires morgan
 * @requires mongoose
 * @requires passport
 * @requires Models
 * @requires express-validator
 * @requires cors
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

// MongoDB connection
// Uncomment the following line to use local MongoDB connection
/*
mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
*/

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

/**
 * @function
 * @name getRoot
 * @description Root endpoint that welcomes users to the app.
 * @memberof module:express
 * @instance
 * @route {GET} /
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.get("/", (req, res) => {
  res.send("Hi, Welcome to my Marvel Movies App!");
});

/**
 * @function
 * @name getAllMovies
 * @description Get all movies, requires JWT authentication.
 * @memberof module:express
 * @instance
 * @route {GET} /movies
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
 * @function
 * @name getMovieByTitle
 * @description Get a movie by title, requires JWT authentication.
 * @memberof module:express
 * @instance
 * @route {GET} /movies/:title
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
 * @function
 * @name getGenreByName
 * @description Get a genre by name, requires JWT authentication.
 * @memberof module:express
 * @instance
 * @route {GET} /movies/genre/:genreName
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
 * @function
 * @name getDirectorByName
 * @description Get a director by name, requires JWT authentication.
 * @memberof module:express
 * @instance
 * @route {GET} /movies/director/:directorName
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
 * @function
 * @name registerUser
 * @description Register a new user with validation.
 * @memberof module:express
 * @instance
 * @route {POST} /users
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
          return res.status(400).send(req.body.Username + "already exists");
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
 * @function
 * @name updateUser
 * @description Update user information with validation and password hashing.
 * @memberof module:express
 * @instance
 * @route {PUT} /users/:id
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
 * @function
 * @name addFavoriteMovie
 * @description Add a movie to a user's favorites.
 * @memberof module:express
 * @instance
 * @route {POST} /users/:id/favorites/:movieId
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
 * @function
 * @name removeFavoriteMovie
 * @description Remove a movie from a user's favorites.
 * @memberof module:express
 * @instance
 * @route {DELETE} /users/:id/favorites/:movieId
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
 * @function
 * @name deleteUser
 * @description Delete a user by ID.
 * @memberof module:express
 * @instance
 * @route {DELETE} /users/:id
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndDelete({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.status(200).send("User deleted successfully");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function
 * @name errorHandler
 * @description Error handling middleware for the application.
 * @memberof module:express
 * @instance
 * @param {express.ErrorRequestHandler} err - The error object.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Server setup
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on Port ${port}`);
});
