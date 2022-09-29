(function(){
  var papaparse, pad, outputDefaultOptions, inputDefaultOptions, schulze;
  if (typeof require != 'undefined' && require !== null) {
    papaparse = require('papaparse');
  }
  pad = function(v, len, alignLeft){
    var spc;
    alignLeft == null && (alignLeft = false);
    spc = repeatString$(" ", len - (v + "").length);
    return alignLeft
      ? (v + "") + spc
      : spc + (v + "");
  };
  outputDefaultOptions = {
    sort: false
  };
  inputDefaultOptions = {
    isRowBased: true,
    higherIsBetter: true,
    showWarning: true
  };
  schulze = function(opt){
    opt == null && (opt = {});
    this.opt = opt;
    this.judges = [];
    this.candidates = [];
    this.data = [];
    this.scores = [];
    this.ballots = [];
    this.partialRank = [];
    this.C = 0;
    this.N = [];
    this.P = [];
    this.pred = [];
    this.D = 'winning votes';
    this.O = [];
    return this;
  };
  import$(schulze, {
    toCsv: function(candidates, opt){
      var c, ret;
      opt == null && (opt = {});
      c = candidates.map(function(it){
        return it;
      });
      ret = [];
      if (opt.sort) {
        c.sort(function(a, b){
          if (a.rank === b.rank) {
            return a.idx - b.idx;
          } else {
            return a.rank - b.rank;
          }
        });
      } else {
        c.sort(function(a, b){
          return a.idx - b.idx;
        });
      }
      return c.map(function(it){
        return "\"" + it.name.replace(/"/g, '"') + "\"," + it.rank;
      }).join('\n').trim();
    },
    toGrid: function(mat){
      var maxlen;
      maxlen = {
        name: Math.max.apply(Math, mat.map(function(d, i){
          return d[0].name.length;
        })),
        value: Math.max.apply(Math, mat.map(function(d, i){
          return Math.max.apply(Math, d.slice(1).map(function(it){
            return (it + "").length;
          }));
        }))
      };
      return mat.map(function(p, j){
        return p.map(function(d, i){
          if (i === j + 1) {
            return pad('-', maxlen.value, true);
          } else if (i > 0) {
            return pad(d, maxlen.value);
          } else {
            return pad(d.name, maxlen.name, true);
          }
        }).join(' ');
      }).join('\n').trim();
    }
  });
  schulze.prototype = import$(Object.create(Object.prototype), {
    toCsv: function(opt){
      if (!this._result) {
        this.compute();
      }
      return schulze.toCsv(this._result.candidates, opt);
    },
    toGrid: function(opt){
      if (!this._result) {
        this.compute();
      }
      return schulze.toGrid(this._result.pairPreferenceMatrix[opt.byIndex ? "byIndex" : "byRank"]);
    },
    fromArray: function(data, opt){
      var this$ = this;
      opt == null && (opt = {});
      this.opt = opt = import$(import$({}, inputDefaultOptions), opt);
      return Promise.resolve().then(function(){
        var ref$, candidateNames, judgeNames;
        this$.data = data;
        ref$ = [
          data.map(function(it){
            return it[0];
          }), JSON.parse(JSON.stringify(data[0]))
        ].map(function(it){
          return it.slice(1, it.length);
        }), candidateNames = ref$[0], judgeNames = ref$[1];
        if (opt.isRowBased) {
          ref$ = [judgeNames, candidateNames], candidateNames = ref$[0], judgeNames = ref$[1];
        }
        this$.judges = judgeNames.map(function(name, idx){
          return {
            name: name,
            idx: idx
          };
        });
        this$.candidates = candidateNames.map(function(name, idx){
          return {
            name: name,
            idx: idx
          };
        });
        this$.C = this$.candidates.length;
        return this$.compute(opt);
      });
    },
    fromJson: function(json, opt){
      var this$ = this;
      opt == null && (opt = {});
      this.opt = opt = import$(import$({}, inputDefaultOptions), opt);
      return Promise.resolve().then(function(){
        var k;
        if (typeof json === 'string') {
          json = JSON.parse(json);
        }
        this$.candidates = json.candidates.map(function(name, idx){
          return {
            name: name,
            idx: idx
          };
        });
        this$.C = this$.candidates.length;
        this$.judges = (function(){
          var results$ = [];
          for (k in json.scores) {
            results$.push(k);
          }
          return results$;
        }()).map(function(name, idx){
          return {
            name: name,
            idx: idx
          };
        });
        this$.data = [[''].concat(this$.candidates.map(function(it){
          return it.name;
        }))].concat(this$.judges.map(function(j){
          return [j.name].concat(json.scores[j.name]);
        }));
        opt.isRowBased = true;
        return this$.compute(opt);
      });
    },
    fromCsv: function(csv, opt){
      var this$ = this;
      opt == null && (opt = {});
      this.opt = opt = import$(import$({}, inputDefaultOptions), opt);
      return Promise.resolve().then(function(){
        var data;
        if (!(papaparse != null)) {
          return Promise.reject(new Error("error: papaparse not found."));
        }
        data = papaparse.parse(csv).data;
        data = data.filter(function(it){
          return it.filter(function(it){
            return it;
          }).length;
        });
        return this$.fromArray(data, opt);
      });
    },
    max: function(p1, p2){
      return this.gt(p1, p2) ? p1 : p2;
    },
    min: function(p1, p2){
      return this.gt(p1, p2) ? p2 : p1;
    },
    gt: function(p1, p2){
      var ef, fe, gh, hg;
      ef = p1[0], fe = p1[1];
      gh = p2[0], hg = p2[1];
      if (ef > fe) {
        return gh <= hg || (gh > hg && (ef > gh || (ef === gh && fe < hg)));
      }
      if (ef === fe) {
        return gh < hg;
      }
      if (ef < fe) {
        return gh < hg && (fe < hg || (fe === hg && ef > gh));
      }
      return false;
    },
    getBallots: function(opt){
      var data, scores, j, i, this$ = this;
      opt == null && (opt = {});
      data = this.data;
      this.scores = scores = !opt.isRowBased
        ? (function(){
          var i$, to$, lresult$, j$, to1$, results$ = [];
          for (i$ = 1, to$ = data[0].length; i$ < to$; ++i$) {
            j = i$;
            lresult$ = [];
            for (j$ = 1, to1$ = data.length; j$ < to1$; ++j$) {
              i = j$;
              lresult$.push(data[i][j]);
            }
            results$.push(lresult$);
          }
          return results$;
        }())
        : (function(){
          var i$, to$, lresult$, j$, to1$, results$ = [];
          for (i$ = 1, to$ = data.length; i$ < to$; ++i$) {
            i = i$;
            lresult$ = [];
            for (j$ = 1, to1$ = data[0].length; j$ < to1$; ++j$) {
              j = j$;
              lresult$.push(data[i][j]);
            }
            results$.push(lresult$);
          }
          return results$;
        }());
      this.ballots = this.judges.map(function(j){
        var ballot, i$, to$, i, value;
        ballot = this$.scores[j.idx];
        for (i$ = 0, to$ = ballot.length; i$ < to$; ++i$) {
          i = i$;
          value = ballot[i];
          if (isNaN(value) && opt.showWarning) {
            console.log("warning: '" + value + "' is type NaN (" + (i + 1) + "th element for " + j.name + ")");
          }
          ballot[i] = +value;
        }
        return ballot.map(function(v){
          var ret;
          if (isNaN(v)) {
            return v;
          }
          ret = ballot.filter(function(it){
            if (opt.higherIsBetter) {
              return it > v;
            } else {
              return it < v;
            }
          });
          return ret.length + 1;
        });
      });
      return this.ballots;
    },
    pairPreferenceMatrix: function(opt){
      var res$, i$, to$, i, lresult$, j$, to1$, j, ref$, len$, judge, ballot, k$;
      opt == null && (opt = {
        invalidType: 'A'
      });
      res$ = [];
      for (i$ = 0, to$ = this.C; i$ < to$; ++i$) {
        i = i$;
        lresult$ = [];
        for (j$ = 0, to1$ = this.C; j$ < to1$; ++j$) {
          j = j$;
          lresult$.push(0);
        }
        res$.push(lresult$);
      }
      this.N = res$;
      for (i$ = 0, len$ = (ref$ = this.judges).length; i$ < len$; ++i$) {
        judge = ref$[i$];
        ballot = this.ballots[judge.idx];
        for (j$ = 0, to$ = this.C; j$ < to$; ++j$) {
          i = j$;
          for (k$ = 0, to1$ = this.C; k$ < to1$; ++k$) {
            j = k$;
            switch (opt.invalidType) {
            case 'A':
              if (isNaN(ballot[i]) || isNaN(ballot[j])) {
                continue;
              }
              if (ballot[i] < ballot[j]) {
                this.N[i][j]++;
              }
              break;
            case 'B':
              if (isNaN(ballot[i])) {
                continue;
              }
              if (isNaN(ballot[j]) || ballot[i] < ballot[j]) {
                this.N[i][j]++;
              }
              break;
            default:
              new Error("calculating pair-preference-matrix: undefined invalid-type");
            }
          }
        }
      }
      return this.N;
    },
    strengthOfStrongestPathMatrix: function(){
      var ref$, C, N, P, i, j, pred, i$, j$, k$, k, minPair;
      ref$ = [this.C, this.N], C = ref$[0], N = ref$[1];
      this.P = P = (function(){
        var i$, to$, lresult$, j$, to1$, results$ = [];
        for (i$ = 0, to$ = C; i$ < to$; ++i$) {
          i = i$;
          lresult$ = [];
          for (j$ = 0, to1$ = C; j$ < to1$; ++j$) {
            j = j$;
            lresult$.push([0, 0]);
          }
          results$.push(lresult$);
        }
        return results$;
      }());
      this.pred = pred = (function(){
        var i$, to$, lresult$, j$, to1$, results$ = [];
        for (i$ = 0, to$ = C; i$ < to$; ++i$) {
          i = i$;
          lresult$ = [];
          for (j$ = 0, to1$ = C; j$ < to1$; ++j$) {
            j = j$;
            lresult$.push(-1);
          }
          results$.push(lresult$);
        }
        return results$;
      }());
      for (i$ = 0; i$ < C; ++i$) {
        i = i$;
        for (j$ = 0; j$ < C; ++j$) {
          j = j$;
          if (i === j) {
            continue;
          }
          P[i][j] = [N[i][j], N[j][i]];
          pred[i][j] = i;
        }
      }
      for (i$ = 0; i$ < C; ++i$) {
        i = i$;
        for (j$ = 0; j$ < C; ++j$) {
          j = j$;
          if (i === j) {
            continue;
          }
          for (k$ = 0; k$ < C; ++k$) {
            k = k$;
            if (i === k || j === k) {
              continue;
            }
            minPair = this.min(P[j][i], P[i][k]);
            if (this.gt(minPair, P[j][k])) {
              P[j][k] = minPair;
              pred[j][k] = pred[i][k];
            }
          }
        }
      }
      return P;
    },
    partialOrder: function(){
      var ref$, C, P, rank, picked, winner, i$, i, win, j$, j, count, k;
      ref$ = [this.C, this.P], C = ref$[0], P = ref$[1];
      this.O = [];
      rank = [];
      picked = {};
      while (rank.length < C) {
        winner = [];
        for (i$ = 0; i$ < C; ++i$) {
          i = i$;
          if (picked[i]) {
            continue;
          }
          win = true;
          for (j$ = 0; j$ < C; ++j$) {
            j = j$;
            if (picked[j]) {
              continue;
            }
            if (i === j) {
              continue;
            }
            if (this.gt(P[j][i], P[i][j])) {
              win = false;
              this.O.push([j, i]);
            }
          }
          if (!win) {
            continue;
          }
          winner.push(i);
        }
        if (!winner.length) {
          break;
        }
        winner.map(fn$);
        count = C - (fn1$()).length + winner.length - 1;
        winner.sort(fn2$);
        rank.push(winner.map(fn3$));
      }
      return this.partialRank = rank;
      function fn$(it){
        return picked[it] = true;
      }
      function fn1$(){
        var results$ = [];
        for (k in picked) {
          results$.push(k);
        }
        return results$;
      }
      function fn2$(a, b){
        return a - b;
      }
      function fn3$(idx){
        return {
          idx: idx,
          count: count
        };
      }
    },
    compute: function(opt){
      var ranks, byIndex, byRank, i$, to$, i, j$, to1$, j, this$ = this;
      opt = opt || this.opt || {};
      this.getBallots(opt);
      this.pairPreferenceMatrix();
      this.strengthOfStrongestPathMatrix();
      this.partialOrder();
      ranks = this.partialRank.reduce(function(a, b){
        return a.concat(b);
      }, []).map(function(c){
        return c.rank = this$.C - c.count, c.name = this$.candidates[c.idx].name, c;
      });
      byIndex = this.N.map(function(d, i){
        return [ranks.filter(function(it){
          return it.idx === i;
        })[0]].concat(d);
      });
      byRank = (function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = this.C; i$ < to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }.call(this)).map(function(d, i){
        return [ranks[i]].concat((function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = this.C; i$ < to$; ++i$) {
            results$.push(i$);
          }
          return results$;
        }.call(this$)).map(function(){
          return 0;
        }));
      });
      for (i$ = 0, to$ = this.C; i$ < to$; ++i$) {
        i = i$;
        for (j$ = 0, to1$ = this.C; j$ < to1$; ++j$) {
          j = j$;
          byRank[i][j + 1] = this.N[ranks[i].idx][ranks[j].idx];
        }
      }
      return this._result = {
        candidates: ranks,
        pairPreferenceMatrix: {
          byIndex: byIndex,
          byRank: byRank
        }
      };
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = schulze;
  } else if (typeof window != 'undefined' && window !== null) {
    window.schulze = schulze;
  }
  function repeatString$(str, n){
    for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
    return r;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
