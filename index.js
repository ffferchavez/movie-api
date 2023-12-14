const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 8080;

// Middleware to log all requests
app.use(morgan("combined"));

// GET route for /movies
app.get("/movies", (req, res) => {
  // JSON object containing data about the top 10 movies
  const movies = [
    { title: "Movie 1", rating: 8 },
    { title: "Movie 2", rating: 7 },
    { title: "Movie 3", rating: 9 },
    { title: "Movie 4", rating: 8 },
    { title: "Movie 5", rating: 8 },
    { title: "Movie 6", rating: 7 },
    { title: "Movie 7", rating: 9 },
    { title: "Movie 8", rating: 6 },
    { title: "Movie 9", rating: 7 },
    { title: "Movie 10", rating: 8 },
  ];

  res.json(movies);
});

// GET route for /
app.get("/", (req, res) => {
  res.send("Welcome to my movies website!");
});

// Serve the documentation.html file
app.use(express.static("public"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
