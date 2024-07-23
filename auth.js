/**
 * @fileoverview This file handles the user authentication process using Passport.
 * It defines the login route and JWT strategy for authentication.
 */

const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport"); // Your local passport file

/**
 * Generates a JWT token for a user
 * @function generateJWTToken
 * @param {Object} user - The user object
 * @returns {string} JWT token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: "7d", // This specifies that the token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/**
 * POST login endpoint
 * @name LoginUser
 * @function
 * @memberof module:auth
 * @param {Object} router - Express router object
 * @returns {JSON} User object with JWT token
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
