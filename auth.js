/**
 * @fileoverview Authentication-related routes and middleware.
 * @requires jwt
 * @requires passport
 * @requires ./passport
 */

const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Your local passport file

/**
 * Generates a JWT token for a given user.
 *
 * @function
 * @param {Object} user - The user object to be encoded in the JWT.
 * @returns {string} The generated JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: "7d", // This specifies that the token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/**
 * Configures the login route for authenticating users with basic HTTP authentication and generating a JWT token.
 *
 * @function
 * @param {Object} router - The Express router object to which the route will be added.
 * @returns {void}
 */
module.exports = (router) => {
  /**
   * POST login route for user authentication.
   * Utilizes Passport's 'local' strategy to authenticate the user and generate a JWT token upon successful login.
   *
   * @name postLogin
   * @memberof module:express
   * @instance
   * @route {POST} /login
   * @param {express.Request} req - The request object containing user credentials.
   * @param {express.Response} res - The response object containing the authentication result and JWT token.
   */
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
