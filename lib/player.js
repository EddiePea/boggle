const Word = require("./words");

class Player {
  constructor(board) {
    this.wordStore = [];
    this.wordsAndScores = [];
    this.totalScore = 0;
    this.board = board;
  }

  static MIN_LENGTH = 4; 

  async addWord(word) {
    let newWord = new Word(word, this.board);
    let isValidWord = await newWord.validateWord();

    if (isValidWord) {
      this.wordStore.unshift(word.toUpperCase());
      return true;

    } else return false;
  }

  getWordScore(word) {
    let newWord = new Word(word, this.board);
    newWord.scoreWord();
    return newWord.getScore();
  }

  updateWordsAndScores() {
    let wordsAndScores = this.wordStore.map(word => {
      let score = this.getWordScore(word);
      return [ word, score ];
    });
    this.wordsAndScores = wordsAndScores;
    console.log("words and scores: ", this.wordsAndScores);
  }

  getWordsAndScores() {
    return this.wordsAndScores;
  }

  getWordStore() {
    return this.wordStore;
  }

  sortWordsAlphabetically() {
    this.wordStore.sort((word1, word2) => {
      if (word1 < word2) {
        return -1;
      } else if (word1 > word2) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  sortWordsByScore() {
    this.wordStore.sort((word1, word2) => {
      let score1 = this.getWordScore(word1);
      let score2 = this.getWordScore(word2);

      if (score1 < score2) {
        return -1;
      } else if (score1 > score2) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  sortWordsAndScoresByScores() {
    this.wordsAndScores.sort((arr1, arr2) => {
      let score1 = arr1[1];
      let score2 = arr2[1];

      return score1 - score2;

    });
  }

  filterByScore(targetScore) {
    return this.wordStore.filter(word => {
      let score = this.getWordScore(word);
      return score === targetScore; 
    });
  }

  calculateTotalScore() {
    this.totalScore = 0;
    this.updateWordsAndScores();

    this.wordsAndScores.forEach(arr => {
      let score = arr[1];
      this.totalScore += score;
    });
  }

  getTotalScore() {
    this.calculateTotalScore();
    return this.totalScore;
  }

  resetGame() {
    this.wordStore = [];
    this.wordsAndScores = [];
    this.totalScore = 0;
  }
}

module.exports = Player;

async function testPlayer() {
  const player = new Player(board);
  
  try {
      await player.addWord("century");
      await player.addWord("bolus");
      await player.addWord("cater");
      player.calculateTotalScore();
      console.log(player.filterByScore(2));

      console.log(`This is the word store: ${player.wordStore}`);
    } catch (error) {
      console.log(`Error verifying word ${player.wordStore}:`, error);
    }
}

if (require.main === module) {
  testPlayer();
}
