const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 8080;

// Middleware to log all requests
app.use(morgan("combined"));

// In-memory array of movies
const movies = [
  {
    title: "Iron Man",
    description:
      "When Tony Stark, an industrialist, is captured, he constructs a high-tech armoured suit to escape. Once he manages to escape, he decides to use his suit to fight against evil forces to save the world.",
    genre: "Science Fiction",
    director: "Jon Favreau",
    producer: "Avi Arad, Kevin Feige",
    date: "May 2, 2008",
    imageUrl: "https://pics.filmaffinity.com/Iron_Man-108960873-large.jpg",
  },
  {
    title: "The Incredible Hulk",
    description:
      "Dr Bruce Banner subjects himself to high levels of gamma radiation, which triggers his transformation into a huge green creature, the Hulk, whenever he experiences negative emotions such as anger.",
    genre: "Science Fiction",
    director: "Louis Leterrier",
    producer: "Avi Arad, Gale Anne Hurd",
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
    producer: "Kevin Feige",
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
    producer: "Kevin Feige",
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
    producer: "Kevin Feige",
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
    producer: "Kevin Feige",
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
    producer: "Kevin Feige",
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
    producer: "Kevin Feige",
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
    producer: "Kevin Feige",
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
    producer: "Kevin Feige",
    date: "Aug 1, 2014",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNDIzMTk4NDYtMjg5OS00ZGI0LWJhZDYtMzdmZGY1YWU5ZGNkXkEyXkFqcGdeQXVyMTI5NzUyMTIz._V1_.jpg",
  },
];

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
