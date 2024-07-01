const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const store = require("connect-loki");

const app = express();
const host = "localhost";
const port = 3000;
const LokiStore = store(session);

const Board = require("./lib/board");
const Player = require("./lib/player");
const Word = require("./lib/words");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
    path: "/",
    secure: false,
  },
  name: "boggle-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
}));

app.use(flash());

// Middleware to initialize player in session 
app.use((req, res, next) => {

  if (req.session.board) {
    req.session.board = Object.assign(new Board(), req.session.board);
  } else {
    req.session.board = new Board();
    req.session.board.makeBoard();
  }

  if (req.session.player) {
    req.session.player = Object.assign(new Player(req.session.board), req.session.player);
  } else {
    req.session.player = new Player(req.session.board);
  }

  next();
});

app.get("/", (req, res) => {
  res.redirect("play");
});

//Extract session info
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.get("/play", (req, res) => {

  res.render("play", { 
    board: req.session.board.getBoard(),
    player: req.session.player,
  });
});

app.post("/play", async (req, res) => {
  let player = req.session.player;
  let word = req.body.word;
 
  if (word) {
    let addedWord = await player.addWord(word, req.session.board.getBoard());

    if (!addedWord) {
      console.log(`This is an error`, addedWord);
      req.flash("error", "This is not a valid word!");

    } else {
      player.updateWordsAndScores();
      let score = player.getWordScore(word);
      req.flash("success", `Added word: ${word.toUpperCase()} with score: ${score}`);
    }

    res.redirect("/play");
  }
});

app.post("/new-game", (req, res) => {
  req.session.board.resetBoard();
  req.session.board.makeBoard();
  req.session.board.getBoard();
  req.session.player = new Player(req.session.board);
  req.flash("success", "Started a new game!");
  res.redirect("/play");
  console.log(req.session.board);
});

app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

//Listener
app.listen(port, host, () => {
  console.log(`Boggle is listening on port ${port} of ${host}`);
});