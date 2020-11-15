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
    // json: Condorcet object. see below.
    var json = schulze.fromCsv(fs.readFileSync("<your-csv-file>").toString(), inputOptions);
    var csv = schulze.toCsv(json.rank, outputOptions);


Condorcet Object:

 - candidates - candidate list with additional information:
   - name: candidate name
   - idx: candidate input order
   - rank: final ranking of this candidate.
   - count: count of win
 - pairPreferenceMatrix: 2D Matrix for pairwise preference strength against every possible pair between candidates.
   - byIndex: matrix ordered by candidate index when input.
   - byRank: matrix ordered by candidate calculated ranking.


## API

 * toGrid(result, option): format pairwise-preference-matrix of schulze result into human-readable grid.
   - result: Condorcet Object.
   - option:
     - `byIndex`: use index-ordered matrix if true, otherise use rank-ordered matrix. default false
 * fromCsv(CSVString, option)
 * fromArray(2DArray, option)
 * fromJson(json, option)
 * toCsv(rank, option)


## Options

Input Options:

 * isRowBased: see next section. default true
 * higherIsBetter: is higher input value means better in score. default true 
 * showWarning: warning for any unparsable input. default true

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


## Test Data Set

You can use tool/dataset-generator.ls to generate some test dataset. usage:

    lsc tool/dataset-generator.ls -- -h

Currently there are several datasets available under `dataset` folder:

 - `rand-c32-j10` - generated with `lsc tool/dataset-generator -- -c 32 -j 10 -r true`
 - `rand-c7-j100` - generated with `lsc tool/dataset-generator -- -c 7 -j 100 -r true`
 - `simple` - handcrafted simple dataset with 3 candidates, 3 judges.
 - `wiki-schulze-method` - scenario in Example section of [Wikipedia: Schulze Method](https://en.wikipedia.org/wiki/Schulze_method)
 - .. and some other datasets under `dataset/dev` folder working in progress.


## Todo List

 * publish in NPM
 * writing test


## Reference

 * [Condorcet Method](https://en.wikipedia.org/wiki/Condorcet_method)
 * [Condorcet Criterion](https://en.wikipedia.org/wiki/Condorcet_criterion)
 * [Condorcet Internet Voting Service](https://civs.cs.cornell.edu/)
 * [Are Condorcet and minimax voting systems the best?](https://arxiv.org/abs/1807.01366)
 * [Participation Criterion](https://en.wikipedia.org/wiki/Participation_criterion)
 * [Exploring the No-Show Paradox for Condorcet Extensions Using Ehrhart Theory and Computer Simulations](http://www.ifaamas.org/Proceedings/aamas2019/pdfs/p520.pdf)
 * [schulze-method by Patrick Herrmann](https://bitbucket.org/patrickherrmann/schulze-method)
 * [Score Voting](https://en.wikipedia.org/wiki/Score_voting)
 * [Why Range Voting is better than Condorcet methods](https://www.rangevoting.org/rangeVcond.html)
 * [Schulze Method](https://en.wikipedia.org/wiki/Schulze_method)


## License

MIT


