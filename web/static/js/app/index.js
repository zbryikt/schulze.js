var sch, local, data, sample, blank, normalize, stripRank, esc, chainHtml, renderExplain, clearResult, clear, update, grid, detail;
sch = new schulze();
local = {};
data = [["", "John", "Joe", "David", "Mary", "Alex"], ["Project 1", 60, 80, 90, 60, 20], ["Project 2", 90, 70, 20, 20, 20], ["Project 3", 80, 60, 20, 30, 80], ["Project 4", '', 90, 50, 50, 20], ["Project 5", 70, 20, '', 80, 60]];
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
esc = function(v){
  return ((v != null ? v : '') + "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};
chainHtml = function(hops, strength){
  var node, weakest;
  if (!(hops || []).length) {
    return '';
  }
  node = function(i){
    return "<span class=\"node\">" + esc(sch.candidates[i].name) + "</span>";
  };
  weakest = function(h){
    if (h.win === strength[0] && h.lose === strength[1]) {
      return ' weakest';
    } else {
      return '';
    }
  };
  return ([node(hops[0].from)].concat(hops.map(function(h){
    return ("<span class=\"link" + weakest(h) + "\">" + h.win + ":" + h.lose + "</span>") + node(h.to);
  }))).join('');
};
renderExplain = function(){
  var node, e, html, i$, ref$, len$, b;
  node = document.querySelector('#explain');
  if (!(local.explainIdx != null) || !local.order || local.order.indexOf(local.explainIdx) < 0) {
    node.innerHTML = '';
    return;
  }
  e = sch.explain(local.explainIdx);
  html = ["<div class=\"ex-head\"><b>" + esc(e.candidate.name) + "</b> <span class=\"ex-rank\">rank " + e.candidate.rank + " of " + sch.C + "</span></div>"];
  if (!e.blockedBy.length) {
    html.push("<p class=\"ex-sub\">nothing beats it - it wins or ties against every other project.</p>");
  } else {
    html.push("<p class=\"ex-sub\">beaten by " + e.blockedBy.length + " project(s). each row below is one strongest path. the highlighted hops are its weakest links - that is what the whole path is worth.</p>");
    for (i$ = 0, len$ = (ref$ = e.blockedBy).length; i$ < len$; ++i$) {
      b = ref$[i$];
      html.push("<div class=\"ex-block\">");
      html.push("<div class=\"ex-block-head\"><b class=\"ex-link\" data-idx=\"" + b.candidate.idx + "\">" + esc(b.candidate.name) + "</b> <span class=\"ex-rank\">rank " + b.candidate.rank + "</span><span class=\"ex-strength\">" + b.strength[0] + ":" + b.strength[1] + "</span></div>");
      if (b.indirect) {
        html.push("<div class=\"ex-note\">" + esc(e.candidate.name) + " actually wins the head to head " + b.direct.lose + ":" + b.direct.win + " - overruled by this chain</div>");
      }
      html.push("<div class=\"chain\">" + chainHtml(b.path, b.strength) + "</div>");
      html.push("</div>");
    }
  }
  if (e.tiedWith.length) {
    html.push("<p class=\"ex-sub\">tied with " + e.tiedWith.map(function(it){
      return esc(it.name);
    }).join(', ') + ".</p>");
  }
  if (e.rankFrom.above.length !== e.blockedBy.length) {
    html.push("<p class=\"ex-sub\">the number reads " + e.candidate.rank + " because " + e.rankFrom.above.length + " project(s) are placed above it - more than the " + e.blockedBy.length + " beating it, since ties above take up numbers too.</p>");
  }
  return node.innerHTML = html.join('');
};
clearResult = function(){
  local.rankCol = null;
  local.order = null;
  detail.data([['']]);
  return renderExplain();
};
clear = function(){
  local = {};
  grid.data([['']]);
  detail.data([['']]);
  return renderExplain();
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
    local.order = pairPreferenceMatrix.byRank.map(function(it){
      return it[0].idx;
    });
    detail.data(local.detail);
    return renderExplain();
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
  enableScrolling: false,
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
  enableScrolling: false,
  cellcfg: function(arg$){
    var row, col, type, d, sel, v, o;
    row = arg$.row, col = arg$.col, type = arg$.type;
    if (type === 'readonly') {
      return true;
    }
    if (type !== 'class') {
      return null;
    }
    d = local.detail;
    if (!d || row < 1) {
      return '';
    }
    sel = local.order && local.explainIdx != null && local.order[row - 1] === local.explainIdx ? 'picked' : '';
    if (col < 2 || col === row + 1) {
      return sel;
    }
    v = (d[row] || [])[col];
    o = (d[col - 1] || [])[row + 1];
    if (!(v != null) || !(o != null)) {
      return sel;
    }
    return (sel + " ") + (v > o
      ? 'win'
      : v < o ? 'lose' : 'tie');
  }
});
grid.on('change', function(){
  return update();
});
document.querySelector('#detail-grid .inner').addEventListener('click', function(e){
  var pos, idx;
  pos = detail.index(e.target);
  if (!pos || !local.order || !(local.order[pos.row - 1] != null)) {
    return;
  }
  idx = local.order[pos.row - 1];
  local.explainIdx = local.explainIdx === idx ? null : idx;
  detail.render();
  renderExplain();
  if (local.explainIdx != null) {
    return document.querySelector('#explain').scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }
});
document.querySelector('#explain').addEventListener('click', function(e){
  var node;
  if (!(node = e.target.closest('.ex-link'))) {
    return;
  }
  local.explainIdx = +node.getAttribute('data-idx');
  detail.render();
  return renderExplain();
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