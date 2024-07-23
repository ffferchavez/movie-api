/**
 * @fileoverview This file sets up the passport strategies for user authentication using JWT and Local strategy.
 */

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Local strategy for username and password authentication
 * @name LocalStrategy
 * @function
 * @memberof module:passport
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log(username + " " + password);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log("incorrect username");
          return callback(null, false, { message: "Incorrect username or password." });
        }

        if (!user.validatePassword(password)) {
          console.log("incorrect password");
          return callback(null, false, { message: "Incorrect password." });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

/**
 * JWT strategy for token verification
 * @name JWTStrategy
 * @function
 * @memberof module:passport
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
