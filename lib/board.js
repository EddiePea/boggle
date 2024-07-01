const Word = require("./words");

class Board {
  constructor() {
    this.board = [];
    this.words = [];
  }

  static dice = [
    'ACCIOT',
    'ABILTY',
    'ABJMOQ',
    'ACDEMP',
    'ACELRS',
    'ADENVZ',
    'AHMORS',
    'BIFORX',
    'DENOSW',
    'DKNOTU',
    'EEFHIY',
    'EGKLUY',
    'EGINTV',
    'ENINPS',
    'ELPSTQ',
    'GILRUW',
  ]

  getAdjacentTiles(tileIndex) {
    const adjacentTiles = {
      0: [1, 4, 5],
      1: [0, 2, 4, 5, 6],
      2: [1, 3, 5, 6, 7],
      3: [2, 6, 7],
      4: [0, 1, 5, 8, 9],
      5: [0, 1, 2, 4, 6, 8, 9, 10],
      6: [1, 2, 3, 5, 7, 9, 10, 11],
      7: [2, 3, 6, 10, 11],
      8: [4, 5, 9, 12, 13],
      9: [4, 5, 6, 8, 10, 12, 13, 14],
      10: [5, 6, 7, 9, 11, 13, 14, 15],
      11: [6, 7, 10, 14, 15],
      12: [8, 9, 13],
      13: [8, 9, 10, 12, 14],
      14: [9, 10, 11, 13, 15],
      15: [10, 11, 14]
    };
      return adjacentTiles[tileIndex];
   } 

  generateRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  shuffleDice(dice) {
    for (let index = dice.length - 1; index > 0; index -= 1) {
      const otherIndex = this.generateRandomNumber(index + 1);
      [dice[index], dice[otherIndex]] = [dice[otherIndex], dice[index]];
    }
    return dice;
  }

  makeBoard() {
    this.resetBoard();
    const shuffledDice = this.shuffleDice([...Board.dice]);

    shuffledDice.forEach(dieString => {
      let face = dieString[this.generateRandomNumber(6)];
      if (face === 'Q') face = 'Qu';
      this.board.push(face);
    });
  }

  generateWordPatterns(tile, path, potentialWords, potentialWordSet) {
    path.push(tile);

    //Form the current word from the path
    let word = path.map(index => this.board[index]).join('');

    //If path length is 4+ store path as possible word
    if (path.length >= 4) {
      potentialWords.push(word);
      potentialWordSet.add(word);
    }

    let adjacentTiles = this.getAdjacentTiles(tile);

    for (let adjacent of adjacentTiles) {
      //ensure tile not used in current path
      if (!path.includes(adjacent)) {
        this.generateWordPatterns(adjacent, path, potentialWords, potentialWordSet);
      }
    }
    path.pop(); //Backtrack: remove last tile from the path
  }

  generateAllWordPatterns() {
    let potentialWords = [];
    let potentialWordSet = new Set();

    for (let index = 0; index < this.board.length; index += 1) {
      this.generateWordPatterns(index, [], potentialWords, potentialWordSet);
    }

    return [...potentialWordSet];
  }

  isOnBoard(word) {
    let wordPatterns = this.generateAllWordPatterns();
    return wordPatterns.includes(word.toUpperCase());
  }

  resetBoard() {
    this.board = [];
  }

  getBoard() {
    return this.board;
  }

  forEach(callback) {
    return this.board.forEach((tile, index) => callback(tile, index));
  }

  toString() {
    this.forEach((tile, index) => console.log(`tile: ${index} letter: ${tile}`));
  }

}

module.exports = Board;


/*
  async generateAllWords() {
    let wordPatterns = this.generateAllWordPatterns();

    for (let pattern of wordPatterns) {
      let newWord = new Word(pattern);
      let isValidWord = await newWord.validateWord();
    }
      if (isValidWord) {
        this.words.push(newWord);
      }
  };
*/