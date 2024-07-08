const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Movie schema definition
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
const userSchema = mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// Hash password middleware
/*userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("Password")) return next();
  bcrypt.hash(user.Password, 10, function (err, hash) {
    if (err) return next(err);
    user.Password = hash;
    next();
  });
});*/

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Validate password method
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Models creation
const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
