# schulze.js

Schulze method JavaScript implementation.

 * [online documentation](http://schulzejs.bindo.la/)
 * [online demo](http://schulzejs.bindo.la/app/)


# Usage

 * install:
   npm install https://github.com/zbryikt/schulze.js

 * in borwser: download schulze.min.js and include it in your HTML with following:
   `
   <script src="<path-to-your>/schulze.min.js"></script>
   `

 * example:
   `
   var fs = require("fs");
   var schulze = require("schulze.js")
   var inputOptions = {}, outputOptions = {};
   /* json = {rank, detail} */
   var json = schulze.fromCsv(fs.readFileSync("<your-csv-file>").toString(), inputOptions);
   var csv = schulze.toCsv(json.rank, outputOptions);
   `

Available API:

 * fromCsv(CSVString, option)
 * fromArray(2DArray, option)
 * fromJSON(json, option)
 * toCsv(rank, option)


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


## Todo List

 * publish in NPM.


## Reference

 * [Are Condorcet and minimax voting systems the best?](https://arxiv.org/abs/1807.01366)


## License

MIT License, Kirby T. Wu, 2018.


