# schulze.js

[Schulze method](https://arxiv.org/abs/1804.02973), JavaScript implementation, while tie breaking is not implemented.

  
 * [online documentation](http://schulzejs.bindo.la/)
 * [online demo](http://schulzejs.bindo.la/app/)


## Installation

with NodeJS:

    npm install --save schulze.js


in browser: download `dist/index.min.js` and include it in your HTML with following:

    <script src="<path-to-your>/index.min.js"></script>

or, from a CDN:

    <script src="https://cdn.jsdelivr.net/gh/zbryikt/schulze.js@v0.2.2/dist/index.min.js"></script>

`fromCsv` additionally requires PapaParse to be loaded beforehand ( it is picked up from
the global `Papa` in browser, or from `require("papaparse")` in NodeJS ).


## Sample Usage

    var fs = require("fs");
    var schulze = require("schulze.js")
    var inputOptions = {}, outputOptions = {};
    var vote = new schulze();
    vote.fromCsv(fs.readFileSync("<your-csv-file>").toString(), inputOptions)
      .then(function(obj) { /* obj: see below. */
        var csv = vote.toCsv(outputOptions);
      });


members in the resolved object:

 - candidates - candidate list with additional information:
   - name: candidate name
   - idx: candidate input order
   - rank: final ranking of this candidate.
   - count: count of win
 - pairPreferenceMatrix: 2D Matrix for pairwise preference strength against every possible pair between candidates.
   - byIndex: matrix ordered by candidate index when input.
   - byRank: matrix ordered by candidate calculated ranking.


## API

 - toGrid(option): format pairwise-preference-matrix of schulze result into human-readable grid.
   - option:
     - `byIndex`: use index-ordered matrix if true, otherise use rank-ordered matrix. default false
 - toCsv(option): format candidates and their rank with CSV format.
   - option:
     - `sort`: sort candidates by their rank. default false ( in input order )
 - fromCsv(CSVString, importOption) - import data in CSV format
 - fromArray(2DArray, importOption) - import data directly as an 2D array
 - fromArraySync(2DArray, importOption) - import data directly as an 2D array. Synchronized version.
 - fromJson(json, importOption) - import data in JSON defined as described below.
 - explain(nameOrIndex) - explain how a candidate ended up at its rank. See next section.
 - toExplanation(nameOrIndex) - the same thing as human readable text.
 - path(fromIndex, toIndex) - one strongest path between two candidates, as a list of
   hops `{from, to, win, lose}`. A single hop means the strongest path is just the head
   to head result. There may be several equally strong paths - this returns one of them.


## Explaining a Rank

A pairwise preference matrix says who beat whom, but not why the ranking came out the
way it did - under the Schulze method a candidate can lose the head to head and still
be ranked above the winner, because it reaches it through a chain of other candidates.
`explain` spells that out:

    vote.explain("Project 5")

    {
      candidate: {idx, name, rank, level},
      blockedBy: [{
        candidate: {idx, name, rank, level},
        strength: [3, 1],       // strength of the strongest path, i.e. its weakest link
        path: [                 // the chain behind it, one entry per hop
          {from: 3, to: 2, win: 3, lose: 1},
          {from: 2, to: 4, win: 3, lose: 1}
        ],
        reverse: {path, strength},   // the strongest path the other way round
        direct: {win: 1, lose: 2},   // the head to head result on its own
        indirect: true               // true when the head to head says otherwise
      }],
      beats: [...],           // candidates this one is ranked above
      tiedWith: [...],        // candidates sharing this rank
      rankFrom: {level, above: [...]}
    }

`toExplanation` renders the same data as text:

    Project 5 is ranked 3 of 5.

    beaten by 2 candidate(s):

      Project 4 ( rank 1 ), path strength 3:1
        Project 5 wins the head to head 2:1, overruled by this chain:
          Project 4 > Project 3  3:1
          Project 3 > Project 5  3:1

      Project 3 ( rank 2 ), path strength 3:1
          Project 3 > Project 5  3:1

Two things are worth keeping apart here:

 - **why a candidate can be no higher** - `blockedBy`. Every candidate beating it, and
   the strongest path behind that win.
 - **why the rank number reads as it does** - `rankFrom`. The rank is 1 + the number of
   candidates placed in earlier levels, so candidates tied above take up numbers without
   beating anything. `rankFrom.above` is therefore often longer than `blockedBy`.


## Import Options

 - isRowBased: one ballot per row if true. default true. See next section for more examples.
 - higherIsBetter: higher input value means better if set to true. default true 
   - true:  Judge prefers A more then B if score of A > score of B
   - false: Judge prefers B more then A if score of A > score of B
 - showWarning: warning for any unparsable input. default true
 - invalidType: how to treat a cell with no valid score ( empty, null or non-numeric ). default `A`
   - `A`: unranked candidates are incomparable and are simply ignored. this is what CIVS does.
   - `B`: every ranked candidate is preferred over every unranked one, with no preference among
     the unranked ones.


## Sample Input Format

Row Based CSV: one ballot / rank preference per row.

    Judge, Cand1,Cand2,Cand3
    JudgeA,    1,    2,    3
    JudgeB,    2,    1,    1
    JudgeC,    3,    4,    1


Column Based CSV: one ballot / rank preference per column.

    Item, JudgeA,JudgeB,JudgeC
    Cand1,     1,     2,     3
    Cand2,     2      1,     4
    Cand3,     3,     1,     1

2DArray: similar to CSV format but in a parsed JS 2D Array.

    [
      ["Candidates", "JudgeA", "JudgeB", "JudgeC"],
      ["Cand1", 1, 2, 3],
      ["Cand2", 2, 1, 1],
      ["Cand3", 3, 4, 1]
    ]


JSON:

    {
      scores: {
        "JudgeA": [1,2,3],
        "JudgeB": [2,1,1],
        "JudgeC": [3,4,1],
      }, candidates: [
        "Cand1", "Cand2", "Cand3"
      ]
    }



## Test Data Set

You can use tool/dataset-generator.ls to generate some test dataset. usage:

    lsc tool/dataset-generator.ls -- -h

Currently there are several datasets available under `dataset` folder:

 - `rand-c5-j5` - generated with `lsc tool/dataset-generator -- -c 5 -j 5 -r true`
 - `rand-c7-j100` - generated with `lsc tool/dataset-generator -- -c 7 -j 100 -r true`
 - `rand-c32-j10` - generated with `lsc tool/dataset-generator -- -c 32 -j 10 -r true`
 - `rand-c200-j20` - generated with `lsc tool/dataset-generator -- -c 200 -j 20`
 - `simple` - handcrafted simple dataset with 3 candidates, 3 judges.
 - `wiki-schulze-method` - scenario in Example section of [Wikipedia: Schulze Method](https://en.wikipedia.org/wiki/Schulze_method)
 - .. and some other datasets under `dataset/dev` folder working in progress.


## Todo List

 * Tie breaking
 * publish in NPM


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
 * [The Schulze Method of Voting](https://arxiv.org/abs/1804.02973)


## License

MIT


