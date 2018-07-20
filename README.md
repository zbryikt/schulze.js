schulze.js
================

Schulze method JavaScript implementation.


Usage
----------------

 * install:
   npm install https://github.com/zbryikt/schulze.js

 * API:
   ```
   var fs = require("fs");
   var schulze = require("schulze.js")
   var inputOptions = {}, outputOptions = {};
   var json = schulze.fromCsv(fs.readFileSync("<your-csv-file>").toString(), inputOptions);
   var csv = schulze.toCsv(json, outputOptions);
   ```

Options
----------------

Input Options:

 * isRowBased: see next section. default true
 * isRank: is input data actually ranking order. default false
 * higherIsBetter: is higher input value means better in score. default true 

Output Options:
 * sort: sort result based on ranking. default false.


Sample Input Format
-----------------

 * Row Based CSV:
   ```
   Item, JudgeA,JudgeB,JudgeC
   Cand1,     1,     2,     3
   Cand2,     2      1,     4
   Cand3,     3,     1,     1
   ```

 * Column Based CSV:
   ```
   Judge, Cand1,Cand2,Cand3
   JudgeA,    1,    2,    3
   JudgeB,    2,    1,    1
   JudgeC,    3,    4,    1
   ```

 * JSON:
   ```
   {
     rank: {
       "JudgeA": [1,2,3],
       "JudgeB": [2,1,1],
       "JudgeC": [3,4,1],
     }, candidateNames: [
       "Cand1", "Cand2", "Cand3"
     ]
   }
   ```


Todo List
----------------

 * publish in NPM.


License
----------------

MIT License, Kirby T. Wu, 2018.


