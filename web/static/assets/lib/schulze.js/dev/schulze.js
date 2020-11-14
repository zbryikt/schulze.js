(function(){
  var papaparse, outputDefaultOptions, inputDefaultOptions, toCsv, fromArray, fromJson, dataValidate, fromCsv, minimax, compute;
  if (typeof require != 'undefined' && require !== null) {
    papaparse = require('papaparse');
  }
  outputDefaultOptions = {
    sort: false
  };
  inputDefaultOptions = {
    isRowBased: true,
    isRank: false,
    higherIsBetter: true
  };
  toCsv = function(computed, options){
    var ret, i$, len$, item;
    options == null && (options = {});
    ret = [];
    if (options.sort) {
      computed.sort(function(a, b){
        return a.rank - b.rank;
      });
    } else {
      computed.sort(function(a, b){
        return a.idx - b.idx;
      });
    }
    for (i$ = 0, len$ = computed.length; i$ < len$; ++i$) {
      item = computed[i$];
      ret.push("\"" + item.name.replace(/"/g, '"') + "\"," + item.rank);
    }
    return ret.join('\n');
  };
  fromArray = function(data, options){
    var rank, ref$, candidateNames, judgeNames, score, j, i, i$, to$;
    options == null && (options = {});
    options = import$(import$({}, inputDefaultOptions), options);
    rank = {};
    ref$ = [
      data.map(function(it){
        return it[0];
      }), JSON.parse(JSON.stringify(data[0]))
    ].map(function(it){
      return it.slice(1, it.length);
    }), candidateNames = ref$[0], judgeNames = ref$[1];
    if (!options.isRowBased) {
      ref$ = [judgeNames, candidateNames], candidateNames = ref$[0], judgeNames = ref$[1];
    }
    score = options.isRowBased
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
    for (i$ = 0, to$ = judgeNames.length; i$ < to$; ++i$) {
      i = i$;
      rank[judgeNames[i]] = score[i];
    }
    dataValidate(rank, options);
    return compute({
      data: rank,
      candidates: candidateNames,
      judges: judgeNames
    });
  };
  fromJson = function(json, options){
    var rank, candidateNames, judgeNames, res$, k;
    options == null && (options = {});
    options = import$(import$({}, inputDefaultOptions), options);
    rank = json.rank;
    candidateNames = json.candidateNames;
    res$ = [];
    for (k in json.rank) {
      res$.push(k);
    }
    judgeNames = res$;
    dataValidate(rank, options);
    return compute({
      data: rank,
      candidates: candidateNames,
      judges: judgeNames
    });
  };
  dataValidate = function(rank, options){
    var judge, list, i$, to$, i, value, results$ = [];
    for (judge in rank) {
      list = rank[judge];
      for (i$ = 0, to$ = list.length; i$ < to$; ++i$) {
        i = i$;
        value = list[i];
        if (isNaN(value)) {
          console.log("warning: '" + value + "' is type NaN (" + (i + 1) + "th element for " + judge + ")");
        }
        list[i] = +value;
      }
      results$.push(rank[judge] = list.map(fn$));
    }
    return results$;
    function fn$(v){
      var ret;
      if (isNaN(v)) {
        return v;
      }
      ret = list.filter(function(it){
        if (options.higherIsBetter) {
          return it > v;
        } else {
          return it < v;
        }
      });
      return ret.length + 1;
    }
  };
  fromCsv = function(csv, options){
    var data, rank, ref$, candidateNames, judgeNames, score, j, i, i$, to$;
    options == null && (options = {});
    if (!(papaparse != null)) {
      throw new Error("error: papaparse not found.");
    }
    options = import$(import$({}, inputDefaultOptions), options);
    data = papaparse.parse(csv).data;
    data = data.filter(function(it){
      return it.filter(function(it){
        return it;
      }).length;
    });
    rank = {};
    ref$ = [
      data.map(function(it){
        return it[0];
      }), JSON.parse(JSON.stringify(data[0]))
    ].map(function(it){
      return it.slice(1, it.length);
    }), candidateNames = ref$[0], judgeNames = ref$[1];
    if (!options.isRowBased) {
      ref$ = [judgeNames, candidateNames], candidateNames = ref$[0], judgeNames = ref$[1];
    }
    score = options.isRowBased
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
    for (i$ = 0, to$ = judgeNames.length; i$ < to$; ++i$) {
      i = i$;
      rank[judgeNames[i]] = score[i];
    }
    dataValidate(rank, options);
    return compute({
      data: rank,
      candidates: candidateNames,
      judges: judgeNames
    });
  };
  minimax = function(arg$){
    var data, candidates, judges, size, d, res$, i$, i, lresult$, j$, j, d2, lresult1$, len$, judge, rank, k$, ref$, mxs, mins, remains, ridx$, k, min, mx, x, max, my, len1$, y, detail, r, to$, list;
    data = arg$.data, candidates = arg$.candidates, judges = arg$.judges;
    size = candidates.length;
    res$ = [];
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      lresult$ = [];
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        lresult$.push(0);
      }
      res$.push(lresult$);
    }
    d = res$;
    res$ = [];
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      lresult1$ = [];
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        lresult1$.push(0);
      }
      res$.push(lresult1$);
    }
    d2 = res$;
    for (i$ = 0, len$ = judges.length; i$ < len$; ++i$) {
      judge = judges[i$];
      rank = data[judge];
      for (j$ = 0; j$ < size; ++j$) {
        i = j$;
        for (k$ = 0; k$ < size; ++k$) {
          j = k$;
          if (rank[i] < rank[j]) {
            d2[i][j]++;
          }
        }
      }
    }
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        d[i][j] = d2[i][j] - d2[j][i];
      }
    }
    ref$ = [[], []], mxs = ref$[0], mins = ref$[1];
    res$ = [];
    for (i$ = 0; i$ < size; ++i$) {
      ridx$ = i$;
      res$.push(ridx$);
    }
    remains = res$;
    for (i$ = 0; i$ < size; ++i$) {
      k = i$;
      if (!remains.length) {
        break;
      }
      ref$ = [judges.length, []], min = ref$[0], mx = ref$[1];
      for (j$ = 0, len$ = remains.length; j$ < len$; ++j$) {
        x = remains[j$];
        ref$ = [0, 0], max = ref$[0], my = ref$[1];
        for (k$ = 0, len1$ = remains.length; k$ < len1$; ++k$) {
          y = remains[k$];
          if (x !== y && max < d[y][x]) {
            ref$ = [d[y][x], y], max = ref$[0], my = ref$[1];
          }
        }
        if (max < min) {
          ref$ = [max, [x]], min = ref$[0], mx = ref$[1];
        } else if (max === min) {
          mx.push(x);
        }
      }
      remains = remains.filter(fn$);
      mxs.push(mx);
      mins.push(min);
    }
    ref$ = [[], [], 1], rank = ref$[0], detail = ref$[1], r = ref$[2];
    for (i$ = 0, to$ = mxs.length; i$ < to$; ++i$) {
      i = i$;
      mxs[i].map(fn1$);
      r = r + mxs[i].length;
    }
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      list = [rank[i].rank, rank[i].name].concat((fn2$()));
      detail.push(list);
    }
    return {
      rank: rank,
      detail: detail
    };
    function fn$(it){
      return !in$(it, mx);
    }
    function fn1$(d){
      return rank.push({
        rank: r,
        idx: d,
        count: mins[i],
        name: candidates[d]
      });
    }
    function fn2$(){
      var i$, to$, results$ = [];
      for (i$ = 0, to$ = size; i$ < to$; ++i$) {
        j = i$;
        results$.push(d[rank[i].idx][rank[j].idx]);
      }
      return results$;
    }
  };
  compute = function(arg$){
    var data, candidates, judges, size, d, res$, i$, i, lresult$, j$, j, p, lresult1$, len$, judge, rank, k$, k, a, b, hash, count, sum, list, v, ref$, detail;
    data = arg$.data, candidates = arg$.candidates, judges = arg$.judges;
    size = candidates.length;
    res$ = [];
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      lresult$ = [];
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        lresult$.push(0);
      }
      res$.push(lresult$);
    }
    d = res$;
    res$ = [];
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      lresult1$ = [];
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        lresult1$.push(0);
      }
      res$.push(lresult1$);
    }
    p = res$;
    for (i$ = 0, len$ = judges.length; i$ < len$; ++i$) {
      judge = judges[i$];
      rank = data[judge];
      for (j$ = 0; j$ < size; ++j$) {
        i = j$;
        for (k$ = 0; k$ < size; ++k$) {
          j = k$;
          if (rank[i] < rank[j]) {
            d[i][j]++;
          }
        }
      }
    }
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        if (i === j) {
          continue;
        }
        if (d[i][j] > d[j][i]) {
          p[i][j] = d[i][j];
        } else {
          p[i][j] = 0;
        }
      }
    }
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        if (i === j) {
          continue;
        }
        for (k$ = 0; k$ < size; ++k$) {
          k = k$;
          if (i === k || j === k) {
            continue;
          }
          p[j][k] = Math.max(p[j][k], Math.min(p[j][i], p[i][k]));
        }
      }
    }
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        a = p[i][j];
        b = p[j][i];
        p[i][j] -= b;
        p[j][i] -= a;
      }
    }
    rank = [];
    hash = {};
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      count = 0;
      for (j$ = 0; j$ < size; ++j$) {
        j = j$;
        if (p[i][j] > 0) {
          count++;
        }
      }
      if (hash[count] != null) {
        hash[count].count++;
      } else {
        hash[count] = {
          count: 1,
          rank: 0
        };
      }
      rank.push({
        idx: i,
        count: count
      });
    }
    rank.sort(function(a, b){
      return b.count - a.count;
    });
    sum = 1;
    res$ = [];
    for (k in hash) {
      v = hash[k];
      res$.push([k, v]);
    }
    list = res$;
    list.sort(function(a, b){
      return b[0] - a[0];
    });
    for (i$ = 0, len$ = list.length; i$ < len$; ++i$) {
      ref$ = list[i$], k = ref$[0], v = ref$[1];
      v.rank = sum;
      sum += v.count;
    }
    rank.map(function(d, i){
      d.rank = hash[d.count].rank;
      return d.name = candidates[d.idx];
    });
    detail = [];
    for (i$ = 0; i$ < size; ++i$) {
      i = i$;
      list = [rank[i].rank, rank[i].name].concat((fn$()));
      detail.push(list);
    }
    return {
      rank: rank,
      detail: detail
    };
    function fn$(){
      var i$, to$, results$ = [];
      for (i$ = 0, to$ = size; i$ < to$; ++i$) {
        j = i$;
        results$.push(d[rank[i].idx][rank[j].idx]);
      }
      return results$;
    }
  };
  if (typeof module != 'undefined' && module !== null) {
    module.exports = {
      compute: compute,
      fromCsv: fromCsv,
      fromJson: fromJson,
      fromArray: fromArray,
      toCsv: toCsv
    };
  } else if (typeof window != 'undefined' && window !== null) {
    window.schulze = {
      compute: compute,
      fromCsv: fromCsv,
      fromJson: fromJson,
      fromArray: fromArray,
      toCsv: toCsv
    };
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
