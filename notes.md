STEPS 

1. 


ISSUES

5. Add button for sort alphabetically

6. Add button for sort according to score 

7. Get all possible words from the board and then check that your word is one of them 

8. Drag cursor across words to add them too 

9. Hover over word to get definition 

10. Add settings so that you can adjust min possible word 

11. Move flash messages to just below the box to submit them

//

- We have an array of 16 letters: [A, X, R, D, U...]

0: A
1: X
2: Y
3: B
4: H
5: I
6: B
7: 
8: 
9: 
10

{
  0: [1, 5, 9], - skip 2, 3, 4 and 6, 7, 8+

  1: [0, 2, 4, 5, 6], - skip 7+

  2: [1, 3, 5, 6, 7], - skip 4, and 8+

  3: [2, 6, 7], = skip 0, 1, 4, 5 and 8+

  4: [0, 1, 5, 8, 9], - skip 2, 3, 6, 7, 10+

  5: [0, 1, 2, 6, 8, 9, 10], - skip 3, 4, 7, 11+

  6: [1, 2, 3, 5, 7, 9, 10, 11], - skip 0, 4, 8, 12+

  7: [2, 3, 6, 10, 11], = skip 0, 1, 4, 5, 8, 9, 12+

  8: [4, 5, 9, 12, 13], = skip 0 to 3, 6, 7, 10, 11, 14+

  9: [4, 5, 6, 8, 10, 12, 13, 14], = skip 0, 1, 2, 3, 7, 11, 15
  10: [5, 6, 7, 9, 11, 13, 14, 15], = skip 0, 1, 2, 3, 4, 8, 12
   
  11: [6, 7, 10, 14, 15], = skip 0, 1, 2, 3, 4, 5, 8, 9, 12, 13

  12: [9, 9, 13], 
  13: [8, 9, 10, 12, 14], 
  14: [9, 10, 11, 13, 15],
  15: [10, 11, 14],
}

- Starting point: 0 - increase to 15
- Starting length: 4 - increase to 16

- Starting index = 0 
  - Increases only when word starting from...

- Outside: let possibleWords = [];
- let possibleWord = ""

- Loop runs while starting index < 16
  - index: 0
  - startingIndex = 0;

  - currentNum = index;
    - possibleWord += boardArr[currentNum]
  - currentNum = numObj[startingIndex][indx] => 1
    - possibleWord += boardArr[currentNum]
  - currentNum = numObj[currentNum][indx] => 

- Process continues until possibleWord.length = 16

1. Get all possible 16 number combos 

  - let numberPattern = [];

  - 1 index 1, rest 0 (or next lowest index)

  - SP: [0], [CN][0] => 1, [CN][1] => 2, [CN][2] => 3, [CN][1] => 6, [CN][4] => 5, [CN][4] => 8, [CN][0] => 4, [CN][4] => 9, [CN][4] => 10, [CN][3] => 7, [CN][4] => 11
        [CN][3] => 14, [CN][3] => 13, [CN][3] => 12

      >> check that newNumber is not in numberPattern already
      >> go for the lowest possible element in the array that isn't taken
      >> stop if: 
        - numberPattern.length === 16
        - no possible choice in array, e.g. returns -1

        - IF secondNumIndx >= numObj[SP].length -> SP += 1...
      >> check if numberPattern is in NumberPattersn already; if not, add to numberPatterns
    
  - SP: [0], second num is index lowest plus 1, rest lowest 
      >> L, L, L+1, L, L 
      >> L, L, L, L+1, L 
      >> L, L, L, L, L+1, L
      >> L, L, L, L, L, L+1, L 

  - SP: 

    SP: [0], [CN][2] => 5 => then continue with lowest possible




  {
  0: [1, 5, 9], - skip 2, 3, 4 and 6, 7, 8+

  1: [0, 2, 4, 5, 6], - skip 7+

  2: [1, 3, 5, 6, 7], - skip 4, and 8+

  3: [2, 6, 7], = skip 0, 1, 4, 5 and 8+

  4: [0, 1, 5, 8, 9], - skip 2, 3, 6, 7, 10+

  5: [0, 1, 2, 6, 8, 9, 10], - skip 3, 4, 7, 11+

  6: [1, 2, 3, 5, 7, 9, 10, 11], - skip 0, 4, 8, 12+

  7: [2, 3, 6, 10, 11], = skip 0, 1, 4, 5, 8, 9, 12+

  8: [4, 5, 9, 12, 13], = skip 0 to 3, 6, 7, 10, 11, 14+

  9: [4, 5, 6, 8, 10, 12, 13, 14], = skip 0, 1, 2, 3, 7, 11, 15

  10: [5, 6, 7, 9, 11, 13, 14, 15], = skip 0, 1, 2, 3, 4, 8, 12
   
  11: [6, 7, 10, 14, 15], = skip 0, 1, 2, 3, 4, 5, 8, 9, 12, 13

  12: [8, 9, 13], 
  13: [8, 9, 10, 12, 14], 
  14: [9, 10, 11, 13, 15],
  15: [10, 11, 14],
}