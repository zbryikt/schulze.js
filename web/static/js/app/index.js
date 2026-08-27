var sch, local, data, sample, blank, normalize, stripRank, clearResult, clear, update, grid, detail;
sch = new schulze();
local = {};
data = [["", "John", "Joe", "David", "Mary"], ["Project 1", 90, 60, 80, 70], ["Project 2", 80, 50, 70, 60], ["Project 3", 70, 40, 60, 50], ["Project 4", 60, '', 50, 40], ["Project 5", 50, 20, '', 30]];
sample = [["", "宜靜", "技安", "阿福", "大雄", "聰明", "世修", "叮噹"], ["林崔馬克", "95", "87", "78", "50", "73", "85", "80"], ["亞洲模擬人權法院", "80", "75", "76", "58", "80", "75", "40"], ["實價登錄 2.0 & 臺灣公寓大廈資料庫", "95", "83", "80", "59", "72", "85", "80"], ["回音森林", "83", "78", "76", "73", "80", "80", "48"], ["好新聞連播網", "83", "78", "76", "85", "86", "75", "72"], ["反制中共網軍入侵中文維基百科", "70", "83", "78", "5", "76", "85", "80"], ["BBC 拍攝", "70", "81", "78", "3", "82", "75", "56"], ["Cofacts 真的假的", "73", "81", "82", "40", "20", "80", "64"], ["2020投票指南", "72", "88", "72", "4", "87", "75", "80"], ["誠徵一日資料申請小幫手 ^^", "84", "90", "86", "74", "86", "85", "48"], ["Rentea 設計給租屋者的開源找屋工具", "81", "78", "72", "60", "72", "80", "40"], ["立志收羅全球知識，機器看得懂的維基百科--Wikidata", "72", "78", "70", "76", "71", "85", "48"], ["全民一起參與2020 總統候選人事實查核", "85", "87", "70", "6", "78", "80", "80"], ["g0v 社群治理討論 ", "73", "81", "74", "2", "72", "85", "48"], ["違章工廠舉報系統", "80", "79", "68", "72", "75", "80", "48"], ["NT01 地球上的夢幻逸品線上型錄", "74", "83", "76", "10", "77", "85", "48"], ["台灣開源義肢計劃", "72", "81", "78", "1", "78", "75", "72"], [" 選舉/金流百科", "95", "79", "66", "70", "89", "75", "80"], ["資料申請小幫手", "70", "79", "64", "3", "73", "75", "40"], ["農業災損幾多錢", "70", "85", "78", "30", "87", "75", "72"], ["大河小溪全民齊督工", "90", "81", "80", "61", "76", "80", "48"], ["開源找屋工具", "87", "89", "88", "80", "91", "75", "48"]];
blank = function(v){
  return !((v != null ? v : '') + "").trim();
};
normalize = function(d){
  var rows, res$, i$, to$, i, cols, len$, r;
  res$ = [];
  for (i$ = 0, to$ = (d || []).length; i$ < to$; ++i$) {
    i = i$;
    res$.push(((d || [])[i] || []).slice());
  }
  rows = res$;
  while (rows.length && rows[rows.length - 1].every(blank)) {
    rows.pop();
  }
  cols = 0;
  for (i$ = 0, len$ = rows.length; i$ < len$; ++i$) {
    r = rows[i$];
    if (r.length > cols) {
      cols = r.length;
    }
  }
  while (cols > 0 && rows.every(fn$)) {
    cols--;
  }
  return rows.map(function(r){
    var i$, to$, i, results$ = [];
    for (i$ = 0, to$ = cols; i$ < to$; ++i$) {
      i = i$;
      if (r[i] != null) {
        results$.push(r[i]);
      } else {
        results$.push('');
      }
    }
    return results$;
  });
  function fn$(r){
    return blank(r[cols - 1]);
  }
};
stripRank = function(d){
  var idx;
  if (!d.length) {
    return d;
  }
  idx = d[0].indexOf('Rank');
  if (idx < 0) {
    return d;
  }
  return d.map(function(r){
    return r.filter(function(v, i){
      return i !== idx;
    });
  });
};
clearResult = function(){
  local.rankCol = null;
  return detail.data([['']]);
};
clear = function(){
  local = {};
  grid.data([['']]);
  return detail.data([['']]);
};
update = function(){
  var raw, votes;
  raw = normalize(grid.data());
  votes = stripRank(raw);
  if (votes.length < 2 || votes[0].length < 2) {
    clearResult();
    if (raw.length && raw[0].indexOf('Rank') >= 0) {
      grid.data(votes);
    }
    return;
  }
  return sch.fromArray(JSON.parse(JSON.stringify(votes)), {
    isRowBased: false,
    showWarning: false
  }).then(function(arg$){
    var candidates, pairPreferenceMatrix, rc, d;
    candidates = arg$.candidates, pairPreferenceMatrix = arg$.pairPreferenceMatrix;
    local.rankCol = rc = votes[0].length;
    d = votes.map(function(it){
      return it.slice();
    });
    d[0][rc] = 'Rank';
    candidates.map(function(c){
      return d[c.idx + 1][rc] = c.rank;
    });
    grid.data(d);
    local.detail = [['', ''].concat(pairPreferenceMatrix.byRank.map(function(it){
      return it[0].rank;
    }))].concat(pairPreferenceMatrix.byRank.map(function(it){
      return [it[0].rank, it[0].name].concat(it.slice(1));
    }));
    return detail.data(local.detail);
  });
};
grid = new sheet({
  root: '#grid .inner',
  data: data,
  idx: {
    row: false,
    col: false
  },
  frozen: {
    row: 1,
    col: 1
  },
  size: {
    col: ['16em']
  },
  'class': {
    col: ['name']
  },
  scrollbar: true,
  cellcfg: function(arg$){
    var row, col, type;
    row = arg$.row, col = arg$.col, type = arg$.type;
    if (type === 'readonly') {
      return local.rankCol != null && col === local.rankCol;
    }
    if (type === 'class') {
      return local.rankCol != null && col === local.rankCol ? 'rank' : '';
    }
    return null;
  }
});
detail = new sheet({
  root: '#detail-grid .inner',
  editing: false,
  idx: {
    row: false,
    col: false
  },
  frozen: {
    row: 1,
    col: 2
  },
  size: {
    col: ['4em', '16em']
  },
  'class': {
    col: ['', 'name']
  },
  scrollbar: true,
  cellcfg: function(arg$){
    var row, col, type, d, v, o;
    row = arg$.row, col = arg$.col, type = arg$.type;
    if (type === 'readonly') {
      return true;
    }
    if (type !== 'class') {
      return null;
    }
    d = local.detail;
    if (!d || row < 1 || col < 2 || col === row + 1) {
      return '';
    }
    v = (d[row] || [])[col];
    o = (d[col - 1] || [])[row + 1];
    if (!(v != null) || !(o != null)) {
      return '';
    }
    if (v > o) {
      return 'win';
    } else if (v < o) {
      return 'lose';
    } else {
      return 'tie';
    }
  }
});
grid.on('change', function(){
  return update();
});
update();
document.querySelector('.btn[data-action=clear]').addEventListener('click', function(){
  return clear();
});
document.querySelector('.btn[data-action=sample]').addEventListener('click', function(){
  clear();
  grid.data(JSON.parse(JSON.stringify(sample)));
  return update();
});