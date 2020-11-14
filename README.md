# schulze.js

Schulze method JavaScript implementation.

  
 * [online documentation](http://schulzejs.bindo.la/)
 * [online demo](http://schulzejs.bindo.la/app/)


## Installation

install locally:

   npm install schulze.js

in borwser: download schulze.min.js and include it in your HTML with following:

    <script src="<path-to-your>/schulze.min.js"></script>


## Sample Usage

    var fs = require("fs");
    var schulze = require("schulze.js")
    var inputOptions = {}, outputOptions = {};
    /* json = {rank, detail} */
    var json = schulze.fromCsv(fs.readFileSync("<your-csv-file>").toString(), inputOptions);
    var csv = schulze.toCsv(json.rank, outputOptions);

## API

 * fromCsv(CSVString, option)
 * fromArray:(2DArray, option)
 * fromJSON(json, option)
 * toCsv(rank, option)


## Options

Input Options:

 * isRowBased: see next section. default true
 * isRank: is input data actually ranking order. default false
 * higherIsBetter: is higher input value means better in score. default true 

Output Options:
 * sort: sort result based on ranking. default false.


## Sample Input Format

Row Based CSV:

    Item, JudgeA,JudgeB,JudgeC
    Cand1,     1,     2,     3
    Cand2,     2      1,     4
    Cand3,     3,     1,     1


Column Based CSV:

    Judge, Cand1,Cand2,Cand3
    JudgeA,    1,    2,    3
    JudgeB,    2,    1,    1
    JudgeC,    3,    4,    1


2DArray:

    [
      ["Candidates", "JudgeA", "JudgeB", "JudgeC"],
      ["Cand1", 1, 2, 3],
      ["Cand2", 2, 1, 1],
      ["Cand3", 3, 4, 1]
    ]


JSON:
    {
      rank: {
        "JudgeA": [1,2,3],
        "JudgeB": [2,1,1],
        "JudgeC": [3,4,1],
      }, candidateNames: [
        "Cand1", "Cand2", "Cand3"
      ]
    }


## Todo List

 * publish in NPM
 * writing test


## Reference

 * [Condorcet method](https://en.wikipedia.org/wiki/Condorcet_method)
 * [Are Condorcet and minimax voting systems the best?](https://arxiv.org/abs/1807.01366)
 * [Participation Criterion](https://en.wikipedia.org/wiki/Participation_criterion)
 * [Exploring the No-Show Paradox for Condorcet Extensions Using Ehrhart Theory and Computer Simulations](http://www.ifaamas.org/Proceedings/aamas2019/pdfs/p520.pdf)
 * [schulze-method by Patrick Herrmann](https://bitbucket.org/patrickherrmann/schulze-method)


## License

MIT


