const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 8080;

// Middleware to log all requests
app.use(morgan("combined"));
app.use(express.json());

// In-memory array of movies
const movies = [
  {
    title: "Iron Man",
    description:
      "When Tony Stark, an industrialist, is captured, he constructs a high-tech armoured suit to escape. Once he manages to escape, he decides to use his suit to fight against evil forces to save the world.",
    genre: "Science Fiction",
    director: "Jon Favreau",

    date: "May 2, 2008",
    imageUrl: "https://pics.filmaffinity.com/Iron_Man-108960873-large.jpg",
  },
  {
    title: "The Incredible Hulk",
    description:
      "Dr Bruce Banner subjects himself to high levels of gamma radiation, which triggers his transformation into a huge green creature, the Hulk, whenever he experiences negative emotions such as anger.",
    genre: "Science Fiction",
    director: "Louis Leterrier",

    date: "June 13, 2008",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTUyNzk3MjA1OF5BMl5BanBnXkFtZTcwMTE1Njg2MQ@@._V1_.jpg",
  },
  {
    title: "Iron Man 2",
    description:
      "Tony Stark is under pressure from various sources, including the government, to share his technology with the world. He must find a way to fight them while also tackling his other enemies.",
    genre: "Science Fiction",
    director: "Louis Leterrier",

    date: "	May 7, 2010",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BZGVkNDAyM2EtYzYxYy00ZWUxLTgwMjgtY2VmODE5OTk3N2M5XkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_.jpg",
  },
  {
    title: "Thor",
    description:
      "Thor is exiled by his father, Odin, the King of Asgard, to the Earth to live among mortals. When he lands on Earth, his trusted weapon Mjolnir is discovered and captured by S.H.I.E.L.D.",
    genre: "Science Fiction",
    director: "Kenneth Branagh",

    date: "May 6, 2011",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BOGE4NzU1YTAtNzA3Mi00ZTA2LTg2YmYtMDJmMThiMjlkYjg2XkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_.jpg",
  },
  {
    title: "Captain America: The First Avenger",
    description:
      "During World War II, Steve Rogers decides to volunteer in an experiment that transforms his weak body. He must now battle a secret Nazi organisation headed by Johann Schmidt to defend his nation.",
    genre: "Science Fiction",
    director: "Joe Johnston",

    date: "July 22, 2011",
    imageUrl:
      "https://m.media-amazon.com/images/I/91zlVmXTLOL._AC_UF894,1000_QL80_.jpg",
  },
  {
    title: "The Avengers",
    description:
      "S.H.I.E.L.D. leader Nick Fury is compelled to launch the Avengers programme when Loki poses a threat to planet Earth. But the superheroes must learn to work together if they are to stop him in time.",
    genre: "Science Fiction",
    director: "Joss Whedon",

    date: "May 4, 2012",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
  },
  {
    title: "Iron Man 3",
    description:
      "Suffering from PTSD, Tony Stark encounters a formidable foe called the Mandarin. When he watches his world fall apart, he must rely on his own instincts as he embarks on a journey of retribution.",
    genre: "Science Fiction",
    director: "Shane Black",

    date: "May 3, 2013",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMjE5MzcyNjk1M15BMl5BanBnXkFtZTcwMjQ4MjcxOQ@@._V1_.jpg",
  },
  {
    title: "Thor: The Dark World",
    description:
      "While investigating a phenomenon, Jane gets sucked into a wormhole. Thor learns about her disappearance and returns to earth just as she reappears. But sensing something amiss, he takes her to Asgard.",
    genre: "Science Fiction",
    director: "Alan Taylor",

    date: "Nov 8, 2013",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTQyNzAwOTUxOF5BMl5BanBnXkFtZTcwMTE0OTc5OQ@@._V1_.jpg",
  },
  {
    title: "Captain America: The Winter Soldier",
    description:
      "Steve Rogers, along with Black Widow and Falcon, must uncover the secrets hidden within S.H.I.E.L.D., while also battling a dangerous new enemy, who is only known as The Winter Soldier.",
    genre: "Science Fiction",
    director: "Anthony and Joe Russo",

    date: "Apr 4, 2014",
    imageUrl:
      "https://m.media-amazon.com/images/I/51TrNJewSNL._AC_UF894,1000_QL80_.jpg",
  },
  {
    title: "Guardians of the Galaxy",
    description:
      "A bunch of skilled criminals led by brash adventurer Peter Quill join hands to fight a villain named Ronan the Accuser who wants to control the universe with the help of a mystical orb.",
    genre: "Science Fiction",
    director: "James Gunn",

    date: "Aug 1, 2014",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNDIzMTk4NDYtMjg5OS00ZGI0LWJhZDYtMzdmZGY1YWU5ZGNkXkEyXkFqcGdeQXVyMTI5NzUyMTIz._V1_.jpg",
  },
];

// In-memory array of genres
const genres = [
  {
    name: "Science Fiction",
    description:
      "Science fiction is a genre that explores the impact of imagined innovations in science or technology.",
  },
  {
    name: "Comedy",
    description:
      "A humorous reflection of life's absurdities that brings joy and laughter.",
  },
];

// In-memory array of directors
const directors = [
  {
    name: "Jon Favreau",
    bio: "Jon Favreau is an American actor, director, producer, and screenwriter. He is known for directing the Iron Man films.",
    birthYear: 1966,
    deathYear: null,
  },
  {
    name: "Louis Leterrier",
    bio: "Louis Leterrier is a French film director, known for directing films like The Incredible Hulk and Clash of the Titans.",
    birthYear: 1973,
    deathYear: null,
  },
  {
    name: "Kenneth Branagh",
    bio: "Kenneth Branagh is a British actor and filmmaker. He directed the film Thor and has been acclaimed for his work in Shakespearean adaptations.",
    birthYear: 1960,
    deathYear: null,
  },
  {
    name: "Joe Johnston",
    bio: "Joe Johnston is an American film director and former visual effects artist. He directed Captain America: The First Avenger and has worked on films like Star Wars and Indiana Jones.",
    birthYear: 1950,
    deathYear: null,
  },
  {
    name: "Joss Whedon",
    bio: "Joss Whedon is an American filmmaker, screenwriter, and television producer. He directed The Avengers and is known for creating TV shows like Buffy the Vampire Slayer and Firefly.",
    birthYear: 1964,
    deathYear: null,
  },
  {
    name: "Shane Black",
    bio: "Shane Black is an American filmmaker and screenwriter. He directed Iron Man 3 and is known for writing and directing films like Lethal Weapon and Kiss Kiss Bang Bang.",
    birthYear: 1961,
    deathYear: null,
  },
  {
    name: "Alan Taylor",
    bio: "Alan Taylor is an American television and film director. He directed Thor: The Dark World and has worked on TV shows like Game of Thrones and The Sopranos.",
    birthYear: 1959,
    deathYear: null,
  },
  {
    name: "Anthony and Joe Russo",
    bio: "Anthony Russo and Joe Russo, collectively known as the Russo brothers, are American film and television directors. They directed Captain America: The Winter Soldier and several other Marvel films.",
    birthYear: null,
    deathYear: null,
  },
  {
    name: "James Gunn",
    bio: "James Gunn is an American filmmaker, actor, and musician. He directed Guardians of the Galaxy and its sequel, and is known for his work in the horror-comedy genre.",
    birthYear: 1966,
    deathYear: null,
  },
];

// In-memory array of users
const users = [];

// GET route for /movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// GET route for /movies/:title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});

// GET route for /genres/:name
app.get("/genres/:name", (req, res) => {
  const { name } = req.params;
  const genre = genres.find((genre) => genre.name === name);

  if (genre) {
    res.json(genre);
  } else {
    res.status(404).send("Genre not found");
  }
});

// GET route for /directors/:name
app.get("/directors/:name", (req, res) => {
  const { name } = req.params;
  const director = directors.find((director) => director.name === name);

  if (director) {
    res.json(director);
  } else {
    res.status(404).send("Director not found");
  }
});

// POST route for /register
app.post("/register", (req, res) => {
  const { email, username } = req.body;

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    res.status(409).send("User already exists");
    return;
  }

  // Create new user
  const newUser = {
    email,
    username,
  };
  users.push(newUser);

  res.status(201).send("User registered successfully");
});

// PATCH route for /users/:id
app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  // Find the user by ID
  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  // Update the user's username
  user.username = username;

  res.send("User info updated successfully");
});

// POST route for /users/:id/favorites
app.post("/users/:id/favorites", (req, res) => {
  const { id } = req.params;
  const { movieId } = req.body;

  // Find the user by ID
  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  // Add the movie to user's favorites
  user.favorites.push(movieId);

  res.send("Movie added to favorites successfully");
});

// DELETE route for /users/:id/favorites/:movieId
app.delete("/users/:id/favorites/:movieId", (req, res) => {
  const { id, movieId } = req.params;

  // Find the user by ID
  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  // Remove the movie from user's favorites
  const index = user.favorites.indexOf(movieId);
  if (index !== -1) {
    user.favorites.splice(index, 1);
  }

  res.send("Movie removed from favorites successfully");
});

// DELETE route for /users/:id
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  // Find the user index by ID
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    res.status(404).send("User not found");
    return;
  }

  // Remove the user from the array
  users.splice(index, 1);

  res.send("User removed successfully");
});

// GET route for /
app.get("/", (req, res) => {
  res.send("Welcome to the Marvel universe!");
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
