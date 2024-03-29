var sch, data, sample, local, versusRenderer, hot, detailtable, count, clear, update, onchange, resize;
sch = new schulze();
data = [["", "John", "Joe", "David", "Mary"], ["Project 1", 90, 60, 80, 70], ["Project 2", 80, 50, 70, 60], ["Project 3", 70, 40, 60, 50], ["Project 4", 60, '', 50, 40], ["Project 5", 50, 20, '', 30]];
sample = [["", "宜靜", "技安", "阿福", "大雄", "聰明", "世修", "叮噹"], ["林崔馬克", "95", "87", "78", "50", "73", "85", "80"], ["亞洲模擬人權法院", "80", "75", "76", "58", "80", "75", "40"], ["實價登錄 2.0 & 臺灣公寓大廈資料庫", "95", "83", "80", "59", "72", "85", "80"], ["回音森林", "83", "78", "76", "73", "80", "80", "48"], ["好新聞連播網", "83", "78", "76", "85", "86", "75", "72"], ["反制中共網軍入侵中文維基百科", "70", "83", "78", "5", "76", "85", "80"], ["BBC 拍攝", "70", "81", "78", "3", "82", "75", "56"], ["Cofacts 真的假的", "73", "81", "82", "40", "20", "80", "64"], ["2020投票指南", "72", "88", "72", "4", "87", "75", "80"], ["誠徵一日資料申請小幫手 ^^", "84", "90", "86", "74", "86", "85", "48"], ["Rentea 設計給租屋者的開源找屋工具", "81", "78", "72", "60", "72", "80", "40"], ["立志收羅全球知識，機器看得懂的維基百科--Wikidata", "72", "78", "70", "76", "71", "85", "48"], ["全民一起參與2020 總統候選人事實查核", "85", "87", "70", "6", "78", "80", "80"], ["g0v 社群治理討論 ", "73", "81", "74", "2", "72", "85", "48"], ["違章工廠舉報系統", "80", "79", "68", "72", "75", "80", "48"], ["NT01 地球上的夢幻逸品線上型錄", "74", "83", "76", "10", "77", "85", "48"], ["台灣開源義肢計劃", "72", "81", "78", "1", "78", "75", "72"], [" 選舉/金流百科", "95", "79", "66", "70", "89", "75", "80"], ["資料申請小幫手", "70", "79", "64", "3", "73", "75", "40"], ["農業災損幾多錢", "70", "85", "78", "30", "87", "75", "72"], ["大河小溪全民齊督工", "90", "81", "80", "61", "76", "80", "48"], ["開源找屋工具", "87", "89", "88", "80", "91", "75", "48"]];
local = {};
versusRenderer = function(instance, td, row, col, prop, value, cellProperties){
  var judges, versus;
  judges = local.judges || [];
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  versus = instance.getDataAtCell(col - 2, row + 2);
  if (row + 2 === col || col < 2) {
    return {};
  }
  td.classList.remove('win', 'lose', 'tie');
  if (value > versus) {
    return td.classList.add('win');
  } else if (value < versus) {
    return td.classList.add('lose');
  } else {
    return td.classList.add('tie');
  }
};
Handsontable.renderers.registerRenderer('versusRenderer', versusRenderer);
hot = new Handsontable(document.querySelector('#grid .inner'), {
  data: data,
  rowHeaders: true,
  colHeaders: true,
  filters: true,
  dropdownMenu: true,
  afterChange: onchange,
  rowHeights: 35,
  colWidths: 80,
  modifyColWidth: function(w, col){
    if (col === 0) {
      return 300;
    }
  },
  stretchH: 'all'
});
Handsontable.hooks.add('beforePaste', function(){
  return clear();
}, hot);
Handsontable.hooks.add('afterPaste', function(){
  return update();
}, hot);
detailtable = new Handsontable(document.querySelector('#detail-grid .inner'), {
  rowHeaders: true,
  colHeaders: true,
  filters: true,
  dropdownMenu: true,
  rowHeights: 30,
  colWidths: 30,
  cells: function(r, c){
    return {
      renderer: 'versusRenderer',
      readOnly: true
    };
  },
  modifyColWidth: function(w, col){
    if (col === 1) {
      return 300;
    }
  },
  stretchH: 'all'
});
count = {
  row: hot.countRows(),
  col: hot.countCols()
};
clear = function(){
  data.splice(0);
  data.push(['']);
  hot.updateSettings({
    data: data,
    cells: function(r, c){
      return {
        readOnly: false
      };
    }
  });
  detailtable.updateSettings({
    data: [['']]
  });
  return local = {};
};
update = function(){
  var votes, judges;
  count.row = hot.countRows();
  count.col = hot.countCols();
  votes = JSON.parse(JSON.stringify(data));
  if (local.ranked) {
    count.col--;
    votes.map(function(it){
      return it.splice(it.length - 1);
    });
  }
  local.judges = judges = votes[0].slice(1);
  return sch.fromArray(votes, {
    isRowBased: false
  }).then(function(arg$){
    var candidates, pairPreferenceMatrix, width, ref$;
    candidates = arg$.candidates, pairPreferenceMatrix = arg$.pairPreferenceMatrix;
    local.ranked = true;
    hot.setDataAtCell(0, count.col, 'Rank');
    hot.updateSettings({
      cells: function(r, c){
        if (c === count.col) {
          return {
            readOnly: true
          };
        } else {
          return {};
        }
      }
    });
    hot.setDataAtCell((function(){
      var i$, to$, results$ = [];
      for (i$ = 0, to$ = candidates.length; i$ < to$; ++i$) {
        results$.push(i$);
      }
      return results$;
    }()).map(function(i){
      var cand;
      cand = candidates[i];
      return [cand.idx + 1, count.col, cand.rank];
    }));
    detailtable.loadData(pairPreferenceMatrix.byRank.map(function(it){
      return [it[0].rank, it[0].name].concat(it.slice(1));
    }));
    width = (ref$ = (count.row - 1) * 30 + 120) > 800 ? ref$ : 800;
    if (width < window.innerWidth * 0.75) {
      width = window.innerWidth * 0.75;
    } else if (width > window.innerWidth) {
      width = window.innerWidth;
    }
    document.querySelector('#detail-grid').style.width = width + "px";
    return detailtable.updateSettings({
      width: width
    });
  });
};
update();
onchange = function(){
  return update();
};
resize = function(){
  var ref$, col, row, i$, r;
  ref$ = Array.from(document.querySelectorAll('input')).map(function(it){
    return +it.value;
  }), col = ref$[0], row = ref$[1];
  if (!isNaN(row) && row > 1) {
    if (row < count.row) {
      for (i$ = count.row - 1; i$ >= row; --i$) {
        r = i$;
        hot.alter("remove_row", r);
      }
    }
    if (row > count.row) {
      for (i$ = count.row; i$ < row; ++i$) {
        r = i$;
        hot.alter("insert_row", r);
      }
    }
    count.row = row;
  }
  if (!isNaN(col) && col > 1) {
    if (col < count.col) {
      for (i$ = count.col - 1; i$ >= col; --i$) {
        r = i$;
        hot.alter("remove_col", r);
      }
    }
    if (col > count.col) {
      for (i$ = count.col; i$ < col; ++i$) {
        r = i$;
        hot.alter("insert_col", r);
      }
    }
    count.col = col;
  }
  return hot.updateSettings({
    cells: function(r, c){
      return r < count.row && c < count.col
        ? {
          readOnly: false
        }
        : {
          readOnly: true
        };
    }
  });
};
document.querySelector('.btn[data-action=clear]').addEventListener('click', function(){
  return clear();
});
document.querySelector('.btn[data-action=sample]').addEventListener('click', function(){
  clear();
  data = JSON.parse(JSON.stringify(sample));
  hot.updateSettings({
    data: data
  });
  return update();
});