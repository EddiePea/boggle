class Word {
  constructor(word, board) {
    this.word = word.toLowerCase();
    this.score = 0;
    this.definition = '';
    this.board = board;
  }

  static scoreList = {
    4: 1,
    5: 2, 
    6: 4,
    7: 6,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
  }

  async getDictionaryEntry() {
    let fetch = (await import("node-fetch")).default;
    let apiKey = "6f5f6736-5ff1-46d3-9f78-e17df6fe90d3";
    let dictionaryUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${this.word}?key=${apiKey}`;

    try {
      let response = await fetch(dictionaryUrl);
      let data = await response.json();

      if (response.ok && Array.isArray(data) && data.length > 0) {
        return data;

      } else {
        throw new Error("No entry found");
      }

    } catch(error) {
      console.log("No entry found", error);
      return false;
    }
  }

  async verifyWordWithDictionary() {
    try {
       let data = await this.getDictionaryEntry(this.word); //Awaits result of getDictionaryEntry 
       if (!data || typeof data[0] === "string") return false;

        //data is an array of objects, each object is an entry for different uses and permutations of the word
        //This checks if there is any object where (i) there is meta data for it, (ii) there is an id for it
        //and the id (trimmed of additional chars and toLowerCase) matches the word entered 
        let exactMatch = this.findExactMatch(data);

        if (exactMatch) {
          //It takes the exact match object and looks for the `fl` property
          //if that property is noun, i.e. it's 'functional label' property value is noun
          //and the headwordinfo property object has a headword property and it starts with an uppercase letter
          //Then it returns true, i.e. it's a proper noun
          let isProperNoun = exactMatch.fl === "noun" && exactMatch.hwi.hw !== exactMatch.hwi.hw.toLowerCase();
          return !isProperNoun;
        } else {
          return false;
        }
    } catch (error) {
        console.log("Error verifying word:", error);
        return false;
    }
  }

  async fetchDefinition() {
    try {
      let data = await this.getDictionaryEntry();

      //console.log(`Response for "${word}":`, JSON.stringify(data, null, 2)); // Log the response for debugging

      if (!data || typeof data[0] === "string") return false;

      //data is an array of objects, each object is an entry for different uses and permutations of the word
      //This checks if there is any object where (i) there is meta data for it, (ii) there is an id for it
      //and the id (trimmed of additional chars and toLowerCase) matches the word entered 
      let exactMatch = this.findExactMatch(data);

      if (!exactMatch || !exactMatch.shortdef || exactMatch.shortdef.length === 0) {
        throw new Error("Error fetching definition");
      }

      let definition = exactMatch.shortdef[0];
      console.log("this is definition", definition);
      this.definition = definition[0].toUpperCase() + definition.slice(1);
      return this.definition;

    } catch(error) {
        console.log("Error fetching definition", error);
        return false;
    }
  }

  async validateWord() {
    if(!/^[a-zA-Z]+$/.test(this.word)) return false;
    if(!this.board.isOnBoard(this.word)) return false;

    let isValidWord = await this.verifyWordWithDictionary();
    return isValidWord;
  }

  trimId(id, word) {
    return id.slice(0, word.length);
  }

  findExactMatch(data) {
    return data.find(entry => {
      let id = this.trimId(entry.meta.id, this.word);
      return entry.meta && id && id.toLowerCase() === this.word;
    });
  }

  scoreWord() {
    this.score += Word.scoreList[this.word.length];
  }

  getScore() {
    return this.score;
  }

  getDefinition() {
    return this.definition;
  }
}

module.exports = Word;

async function testWord() {
  const word = new Word("bear");
  try {
    const isValid = await word.validateWord();
    console.log(`this is the result`, isValid);
    console.log(`Is ${word.word} a valid word?`, isValid);

    if (isValid) {
      const definition = await word.fetchDefinition();
      console.log(`Definition of`, word, definition);
    }

  } catch (error) {
    console.log(`Error verifying word ${word}:`, error);
  }
}

if (require.main === module) {
  testWord();
}
