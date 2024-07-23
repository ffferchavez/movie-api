/**
 * @fileoverview Passport strategies for authentication: LocalStrategy and JWTStrategy.
 * @requires passport
 * @requires passport-local
 * @requires ./models.js
 * @requires passport-jwt
 */

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Passport strategy for local authentication using username and password.
 * 
 * @function
 * @param {Object} options - The options for the LocalStrategy.
 * @param {string} options.usernameField - The field in the request body containing the username.
 * @param {string} options.passwordField - The field in the request body containing the password.
 * @param {Function} verify - Function to verify the credentials.
 * @param {string} username - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @param {Function} callback - Callback function to handle the result of authentication.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            console.log("incorrect username");
            return callback(null, false, {
              message: "Incorrect username or password.",
            });
          }
          if (!user.validatePassword(password)) {
            console.log("incorrect password");
            return callback(null, false, { message: "Incorrect password." });
          }
          console.log("finished");
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    }
  )
);

/**
 * Passport strategy for JWT authentication.
 * 
 * @function
 * @param {Object} options - The options for the JWTStrategy.
 * @param {Function} verify - Function to verify the JWT token.
 * @param {Object} jwtPayload - The decoded JWT payload.
 * @param {Function} callback - Callback function to handle the result of authentication.
 * @param {string} jwtPayload._id - The user ID extracted from the JWT payload.
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    async (jwtPayload, callback) => {
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
