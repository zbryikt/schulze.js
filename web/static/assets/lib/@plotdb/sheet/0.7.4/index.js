(function(){
  var parseCsv, parent, idxToLabel, labelToIdx, sheet;
  parseCsv = function(txt){
    if (typeof Papa != 'undefined' && Papa !== null) {
      return Papa.parse(txt).data;
    } else {
      return [[txt]];
    }
  };
  parent = function(n, s, e){
    var m;
    m = n;
    while (n && n !== e) {
      n = n.parentNode;
    }
    if (n !== e) {
      return null;
    }
    if (!s) {
      return n;
    }
    n = m;
    while (n && n !== e && (!n.matches || (n.matches && !n.matches(s)))) {
      n = n.parentNode;
    }
    if (n === e && (!e.matches || !e.matches(s))) {
      return null;
    }
    return n;
  };
  idxToLabel = function(val){
    var radix, base, v, map, ret, i$, i, c;
    radix = Math.floor(Math.log((val + 1) * 25 + 1) / Math.log(26)) - 1;
    base = (Math.pow(26, radix + 1) - 1) / 25 - 1;
    v = val - base;
    map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    ret = "";
    for (i$ = 0; i$ <= radix; ++i$) {
      i = i$;
      c = map.charAt(v % 26);
      ret = c + ret;
      v = (v - v % 26) / 26;
    }
    return ret;
  };
  labelToIdx = function(label){
    var radix, base, map, val, i$, i, idx;
    radix = label.length - 1;
    base = (Math.pow(26, radix + 1) - 1) / 25 - 1;
    map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    val = 0;
    for (i$ = 0; i$ <= radix; ++i$) {
      i = i$;
      idx = map.indexOf(label[i]);
      if (idx < 0) {
        throw new Error("incorrect label");
      }
      val = val * 26 + idx;
    }
    return val + base;
  };
  sheet = function(opt){
    var ref$, this$ = this;
    opt == null && (opt = {});
    this.opt = opt;
    this.root = typeof opt.root === 'string'
      ? document.querySelector(opt.root)
      : opt.root;
    this.evtHandler = {};
    this._ccfg = typeof opt.cellcfg === 'function' ? opt.cellcfg : null;
    this._data = opt.data || [];
    this._size = {
      row: (ref$ = import$({
        row: [],
        col: []
      }, opt.size)).row,
      col: ref$.col
    };
    this.cls = {
      row: (ref$ = import$({
        row: [],
        col: []
      }, opt['class'])).row,
      col: ref$.col
    };
    this._editing = opt.editing != null ? !!opt.editing : true;
    this.dim = {
      col: (opt.dim || (opt.dim = {})).col || 30,
      row: (opt.dim || (opt.dim = {})).row || 30
    };
    this.frozen = {
      col: (ref$ = import$({
        col: 0,
        row: 0
      }, opt.frozen || {})).col,
      row: ref$.row
    };
    this.idx = {
      col: (ref$ = import$({
        row: true,
        col: true
      }, opt.idx || {})).col,
      row: ref$.row
    };
    this.fixed = {
      col: (ref$ = import$({
        col: 0,
        row: 0
      }, opt.fixed || {})).col,
      row: ref$.row
    };
    this.xif = {
      row: [this.idx.row ? 1 : 0, 0, 0],
      col: [this.idx.col ? 1 : 0, 0, 0]
    };
    ['row', 'col'].map(function(t){
      this$.xif[t][1] = this$.xif[t][0] + this$.fixed[t];
      return this$.xif[t][2] = this$.xif[t][1] + this$.frozen[t];
    });
    this.fix = {
      row: this.xif.row[2],
      col: this.xif.col[2]
    };
    this.pos = {
      col: 0,
      row: 0
    };
    this.scrollPos = {
      x: 0,
      y: 0
    };
    this.sel = {
      cut: {}
    };
    this.les = {};
    this.editing = {};
    this.dom = Object.fromEntries(['sheet', 'inner', 'caret', 'range', 'edit', 'layout', 'range-cut', 'slide-y', 'slide-x', 'scroll-y', 'scroll-x'].map(function(it){
      var x$, n;
      x$ = n = document.createElement('div');
      x$.classList.add(it);
      return [it, n];
    }));
    this.dom.sheet.setAttribute('tabindex', -1);
    this.dom.textarea = document.createElement('textarea');
    this.root.appendChild(this.dom.sheet);
    ['inner', 'caret', 'range', 'edit', 'layout', 'range-cut', 'slide-y', 'slide-x', 'scroll-y', 'scroll-x'].map(function(it){
      return this$.dom.sheet.appendChild(this$.dom[it]);
    });
    if (!this.opt.slider) {
      this.dom["slide-x"].style.display = this.dom["slide-y"].style.display = 'none';
    }
    this.scrollbar = !!this.opt.scrollbar;
    ['x', 'y'].map(function(it){
      var x$, n;
      x$ = n = document.createElement('div');
      x$.classList.add('thumb');
      this$.dom["scroll-" + it].appendChild(n);
      this$.dom["thumb-" + it] = n;
      if (!this$.scrollbar) {
        return this$.dom["scroll-" + it].style.display = 'none';
      }
    });
    if (this.scrollbar) {
      this.dom.sheet.classList.add('has-scrollbar');
    }
    this.dom.edit.appendChild(this.dom.textarea);
    this._init();
    return this;
  };
  sheet.prototype = import$(Object.create(Object.prototype), {
    on: function(n, cb){
      var ref$;
      return ((ref$ = this.evtHandler)[n] || (ref$[n] = [])).push(cb);
    },
    fire: function(n){
      var v, res$, i$, to$, ref$, len$, cb, results$ = [];
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      v = res$;
      for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        results$.push(cb.apply(this, v));
      }
      return results$;
    },
    _init: function(){
      var i$, to$, r, j$, to1$, c, dom, _dp, _dparse, _obj, ref$, ref1$, ref2$, this$ = this;
      for (i$ = 0, to$ = this.dim.row; i$ < to$; ++i$) {
        r = i$;
        for (j$ = 0, to1$ = this.dim.col; j$ < to1$; ++j$) {
          c = j$;
          this.addCell(c, r);
        }
      }
      this.regrid();
      this.dom.textarea.addEventListener('mousedown', function(e){
        return e.stopPropagation();
      });
      this.dom.sheet.addEventListener('contextmenu', function(e){
        this$.fire('menu.on', {
          evt: e,
          node: e.target
        });
        if (this$._menuOff) {
          return;
        }
        this$._menuOff = function(e){
          if (e.type === 'keydown' && e.keyCode !== 27) {
            return;
          }
          document.body.removeEventListener('click', this$._menuOff);
          document.body.removeEventListener('keydown', this$._menuOff);
          this$._menuOff = null;
          return this$.fire('menu.off', {
            evt: e,
            node: e.target
          });
        };
        document.body.addEventListener('click', this$._menuOff);
        return document.body.addEventListener('keydown', this$._menuOff);
      });
      dom = this.dom.sheet;
      dom.addEventListener('mousedown', function(e){
        var p, ref$, idx;
        if (e.button > 1) {
          return;
        }
        this$.dom.textarea.focus();
        this$.edited();
        if (!(p = parent(e.target, '.cell', dom))) {
          return;
        }
        idx = {
          row: (ref$ = this$.index(p)).row,
          col: ref$.col
        };
        if (idx.col < 0 || idx.row < 0) {
          this$.les.node = this$.cell(this$.les.start);
          if (!(e.shiftKey && this$.les.start)) {
            this$.les.start = {
              col: (ref$ = idx.col) > 0 ? ref$ : 0,
              row: (ref$ = idx.row) > 0 ? ref$ : 0
            };
            this$.les.node = this$.cell(this$.les.start);
          }
          this$.les.end = {
            col: idx.col >= 0 ? idx.col : undefined,
            row: idx.row >= 0 ? idx.row : undefined
          };
          this$.renderSelection();
          return;
        }
        if (e.shiftKey && this$.les.start) {
          this$.les.end = idx;
        } else {
          this$.les.start = this$.les.end = idx;
          this$.les.node = p;
        }
        return this$.renderSelection();
      });
      dom.addEventListener('mousemove', function(e){
        var p, ref$, idx;
        if (this$._slider.y.on || this$._slider.x.on || this$._scrolling) {
          return;
        }
        if (this$.editing.on || !(e.buttons && (p = parent(e.target, '.cell', dom)))) {
          return;
        }
        idx = {
          row: (ref$ = this$.index(p)).row,
          col: ref$.col
        };
        this$.les.end = {
          col: idx.col >= 0 ? idx.col : undefined,
          row: idx.row >= 0 ? idx.row : undefined
        };
        return this$.renderSelection();
      });
      dom.addEventListener('dblclick', function(e){
        var p;
        if (!(p = parent(e.target, '.cell', dom))) {
          return;
        }
        return this$.edit({
          node: p,
          quick: false
        });
      });
      _dp = new DOMParser();
      _dparse = function(it){
        return _dp.parseFromString(it, 'text/html');
      };
      document.body.addEventListener('paste', function(e){
        var d, data, raw, s, ref$, sc, ec, sr, er, i$, row, j$, col;
        if (!parent(document.activeElement, '.sheet', dom)) {
          return;
        }
        if (!this$.les.start) {
          return;
        }
        if (in$('text/html', e.clipboardData.types || [])) {
          d = _dparse(e.clipboardData.getData('text/html'));
          data = Array.from(d.querySelectorAll('tr')).map(function(n){
            return Array.from(n.querySelectorAll('th,td')).map(function(n){
              return n.textContent;
            });
          });
        } else {
          raw = e.clipboardData.getData('text');
          data = parseCsv(raw);
        }
        this$.set({
          row: this$.les.start.row,
          col: this$.les.start.col,
          data: data,
          range: true,
          src: 'user'
        });
        if (this$.sel.cut) {
          s = this$._toText({
            sel: this$.sel.cut
          });
          if (s === raw) {
            ref$ = this$._bound({
              sel: this$.sel.cut
            }), sc = ref$.sc, ec = ref$.ec, sr = ref$.sr, er = ref$.er;
            for (i$ = sr; i$ <= er; ++i$) {
              row = i$;
              for (j$ = sc; j$ <= ec; ++j$) {
                col = j$;
                this$.set({
                  row: row,
                  col: col,
                  data: "",
                  src: 'user'
                });
              }
            }
            navigator.clipboard.writeText('');
          }
          this$.sel.cut = null;
          return this$.dom["range-cut"].classList.toggle('show', false);
        }
      });
      this.dom.textarea.addEventListener('keypress', function(e){
        var ref$;
        if (((ref$ = e.keyCode) === 31 || ref$ === 61 || ref$ === 67 || ref$ === 88) && (e.metaKey || e.ctrlKey)) {
          return;
        }
        if (this$.les.node && !this$.editing.on) {
          this$.edit({
            node: this$.les.node,
            quick: e.keyCode === 13 ? false : true
          });
          if (e.keyCode === 13) {
            return e.preventDefault();
          }
        }
      });
      this.dom.textarea.addEventListener('keydown', function(e){
        var code, ref$, sc, ec, sr, er, data, res$, i$, row, lresult$, j$, col, opt, lbox, box;
        code = e.keyCode;
        if (e.keyCode === 86 && (e.metaKey || e.ctrlKey)) {
          return;
        }
        if (!this$.editing.on) {
          if (e.keyCode === 67 && (e.metaKey || e.ctrlKey)) {
            return this$.copy();
          }
          if (e.keyCode === 88 && (e.metaKey || e.ctrlKey)) {
            return this$.copy({
              cut: true
            });
          }
        }
        if (!this$.eventInScope(e)) {
          return;
        }
        if (code === 8) {
          if (!this$.les.node) {
            return;
          }
          ref$ = this$._bound(), sc = ref$.sc, ec = ref$.ec, sr = ref$.sr, er = ref$.er;
          res$ = [];
          for (i$ = sr; i$ <= er; ++i$) {
            row = i$;
            lresult$ = [];
            for (j$ = sc; j$ <= ec; ++j$) {
              col = j$;
              lresult$.push('');
            }
            res$.push(lresult$);
          }
          data = res$;
          this$.set({
            row: sr,
            col: sc,
            data: data,
            range: true,
            src: 'user'
          });
          this$.render();
        }
        if (code === 189 && (e.metaKey || e.ctrlKey)) {
          this$.slice();
        }
        if (code === 187 && (e.metaKey || e.ctrlKey)) {
          this$.insert();
        }
        opt = (function(){
          switch (code) {
          case 37:
            return {
              y: 0,
              x: -1
            };
          case 38:
            return {
              y: -1,
              x: 0
            };
          case 39:
            return {
              y: 0,
              x: 1
            };
          case 40:
            return {
              y: 1,
              x: 0
            };
          case 9:
            return {
              y: 0,
              x: 1
            };
          default:
            return null;
          }
        }());
        if (opt) {
          if (this$.editing.on && !this$.editing.quick) {
            return;
          }
          this$.move((opt.select = e.shiftKey, opt));
          e.stopPropagation();
          e.preventDefault();
          this$.dom.textarea.focus();
        }
        if (this$.les.node && !this$.editing.on) {
          if ((ref$ = e.keyCode) === 37 || ref$ === 38 || ref$ === 39 || ref$ === 40 || ref$ === 9 || ref$ === 16 || ref$ === 18 || ref$ === 91 || ref$ === 27 || ref$ === 17) {
            return;
          }
          if (((ref$ = e.keyCode) === 31 || ref$ === 61 || ref$ === 67 || ref$ === 88) && (e.metaKey || e.ctrlKey)) {
            return;
          }
          this$.edit({
            node: this$.les.node,
            quick: e.keyCode === 13 ? false : true
          });
          if (e.keyCode === 13) {
            e.preventDefault();
          }
          return;
        }
        if (!this$.editing.on) {
          return;
        }
        if (e.keyCode === 27) {
          this$.edited({
            cancel: true
          });
          e.stopPropagation();
          e.preventDefault();
          this$.dom.textarea.focus();
          return;
        }
        if (e.keyCode === 13 && !(e.altKey || e.metaKey)) {
          this$.move({
            y: 1,
            x: 0
          });
          e.stopPropagation();
          e.preventDefault();
          this$.dom.textarea.focus();
          return;
        }
        if (e.keyCode === 13 && (e.altKey || e.metaKey)) {
          this$.dom.textarea.value += '\n';
          this$.dom.layout.textContent = this$.dom.textarea.value + " ";
          lbox = this$.dom.layout.getBoundingClientRect();
          box = this$.editing.node.getBoundingClientRect();
          return ref$ = this$.dom.textarea.style, ref$.width = Math.max(lbox.width, box.width + 1) + "px", ref$.height = Math.max(lbox.height, box.height + 1) + "px", ref$;
        }
      });
      _obj = this;
      this._slider = {
        hc: function(evt){
          var box, c, d;
          box = evt.target.getBoundingClientRect();
          c = box[this.t[3]] + box[this.t[4]] / 2;
          d = this.dir * Math.sign(evt[this.t[2]] - c);
          _obj[d < 0
            ? this.t[1]
            : this.t[0]](1);
          return _obj.renderSelection();
        },
        hd: function(evt){
          var this$ = this;
          this.on = true;
          this.p = evt[this.t[2]];
          document.addEventListener('mouseup', function(e){
            return this$.hu(e);
          });
          return document.addEventListener('mousemove', function(e){
            return this$.hm(e);
          });
        },
        hu: function(evt){
          this.on = false;
          document.removeEventListener('mouseup', this.hu);
          return document.removeEventListener('mousemove', this.hm);
        },
        hm: function(evt){
          var d, u, v;
          if (!this.on) {
            return;
          }
          d = this.p - evt[this.t[2]];
          u = Math.abs(d);
          u = u > 500
            ? 10
            : u > 300
              ? 5
              : u > 150
                ? 2
                : u > 100 ? 1 : 0.3;
          if (u < 1) {
            u = Math.random() < u ? 1 : 0;
          }
          v = Math.sign(d) * this.dir * u;
          if (v > 0) {
            _obj[this.t[1]](v);
          }
          if (v < 0) {
            _obj[this.t[0]](v);
          }
          return _obj.renderSelection();
        }
      };
      this._slider.y = (ref1$ = {
        n: 'slide-y',
        on: false,
        p: 0,
        t: ['_mu', '_md', 'clientY', 'y', 'height'],
        dir: -1
      }, ref1$.hd = (ref$ = this._slider).hd, ref1$.hu = ref$.hu, ref1$.hm = ref$.hm, ref1$.hc = ref$.hc, ref1$);
      this._slider.x = (ref2$ = {
        n: 'slide-x',
        on: false,
        p: 0,
        t: ['_mr', '_ml', 'clientX', 'x', 'width'],
        dir: 1
      }, ref2$.hd = (ref1$ = this._slider).hd, ref2$.hu = ref1$.hu, ref2$.hm = ref1$.hm, ref2$.hc = ref1$.hc, ref2$);
      ['x', 'y'].map(function(n){
        this$.dom[this$._slider[n].n].addEventListener('mousedown', function(e){
          return this$._slider[n].hd(e);
        });
        return this$.dom[this$._slider[n].n].addEventListener('click', function(e){
          return this$._slider[n].hc(e);
        });
      });
      if (this.scrollbar) {
        ['x', 'y'].map(function(n){
          return this$.dom["scroll-" + n].addEventListener('mousedown', function(e){
            var ref$, t, cl, box, info, d;
            e.preventDefault();
            e.stopPropagation();
            if (e.target === this$.dom["thumb-" + n]) {
              return this$._scrollDrag(n, e);
            }
            ref$ = n === 'y'
              ? ['row', 'clientY']
              : ['col', 'clientX'], t = ref$[0], cl = ref$[1];
            box = this$.dom["thumb-" + n].getBoundingClientRect();
            info = this$._scrollInfo(t);
            d = e[cl] < box[n === 'y' ? 'top' : 'left'] ? -1 : 1;
            return this$._scrollTo(t, this$.pos[t] + d * ((ref$ = info.vis) > 1 ? ref$ : 1), info);
          });
        });
        if (window.ResizeObserver != null) {
          this._ro = new ResizeObserver(function(){
            return this$.renderScrollbar();
          });
          this._ro.observe(this.dom.sheet);
        }
      }
      document.addEventListener('wheel', function(e){
        var inscope, spos, ref$, dx, dy, ox, oy;
        inscope = this$.eventInScope(e);
        if (this$.opt.enableScrolling != null && !this$.opt.enableScrolling) {
          return;
        }
        if (!(this$.opt.scrollLock != null) || this$.opt.scrollLock) {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (inscope || e.target === document.body) {
              e.preventDefault();
            }
          }
        }
        if (!inscope) {
          return false;
        }
        spos = this$.scrollPos;
        ref$ = [e.deltaX, e.deltaY], dx = ref$[0], dy = ref$[1];
        if (e.shiftKey && Math.abs(dy) > Math.abs(dx)) {
          ref$ = [dy, 0], dx = ref$[0], dy = ref$[1];
        }
        ref$ = Math.abs(dx) > Math.abs(dy)
          ? [dx, 0]
          : [0, dy], dx = ref$[0], dy = ref$[1];
        ref$ = [spos.x, spos.y], ox = ref$[0], oy = ref$[1];
        spos.x += dx / 30;
        spos.y += dy / 30;
        dx = Math.round(spos.x) - Math.round(ox);
        dy = Math.round(spos.y) - Math.round(oy);
        if (dy > 0) {
          this$._md(dy);
        } else if (dy < 0) {
          this$._mu(dy);
        } else if (dx > 0) {
          this$._mr(dx);
        } else if (dx < 0) {
          this$._ml(dx);
        }
        this$.renderSelection();
        return e.preventDefault();
      }, {
        passive: false
      });
      return this.renderScrollbar();
    },
    select: function(o){
      var ret, that;
      if (!arguments.length) {
        ret = {};
        if (!this.les.start) {
          return null;
        }
        ret.col = this.les.start.col;
        ret.row = this.les.start.row;
        if (!this.les.end) {
          ret.colspan = 1;
          ret.rowspan = 1;
          return ret;
        }
        if (this.les.end.col == null) {
          delete ret.col;
        } else {
          ret.colspan = this.les.end.col - ret.col + 1;
        }
        if (this.les.end.row == null) {
          delete ret.row;
        } else {
          ret.rowspan = this.les.end.row - ret.row + 1;
        }
        return ret;
      }
      this.les = {};
      if (o) {
        this.les = {
          start: {
            col: 0,
            row: 0
          },
          end: {}
        };
        if (o.row != null) {
          this.les.start.row = o.row;
          this.les.end.row = o.row + ((that = o.rowspan) ? that > 1 ? that : 1 : 1) - 1;
        }
        if (o.col != null) {
          this.les.start.col = o.col;
          this.les.end.col = o.col + ((that = o.colspan) ? that > 1 ? that : 1 : 1) - 1;
        }
      }
      this.renderSelection();
    },
    _bound: function(o){
      var sel, ref$, p1, p2, sc, ec, sr, er;
      o == null && (o = {});
      sel = o.sel || this.les;
      ref$ = [sel.start, sel.end], p1 = ref$[0], p2 = ref$[1];
      if (!(p1 && p2)) {
        return {
          sc: 0,
          ec: 0,
          sr: 0,
          er: 0
        };
      }
      ref$ = p1.col < p2.col || p2.col == null
        ? [p1.col, p2.col]
        : [p2.col, p1.col], sc = ref$[0], ec = ref$[1];
      ref$ = p1.row < p2.row || p2.row == null
        ? [p1.row, p2.row]
        : [p2.row, p1.row], sr = ref$[0], er = ref$[1];
      if (o.defined == null || o.defined) {
        if (ec == null) {
          ec = this._dataSize('col') - 1;
        }
        if (er == null) {
          er = this._dataSize('row') - 1;
        }
      }
      return {
        sc: sc,
        ec: ec,
        sr: sr,
        er: er
      };
    },
    _toText: function(arg$){
      var sel, c, ref$, sc, ec, sr, er, i$, row, r, j$, col, content, s;
      sel = arg$.sel;
      if (!(sel && sel.start)) {
        return '';
      }
      c = [];
      ref$ = this._bound({
        sel: sel
      }), sc = ref$.sc, ec = ref$.ec, sr = ref$.sr, er = ref$.er;
      for (i$ = sr; i$ <= er; ++i$) {
        row = i$;
        r = [];
        for (j$ = sc; j$ <= ec; ++j$) {
          col = j$;
          if ((content = ((ref$ = this._data)[row] || (ref$[row] = []))[col]) == null) {
            content = '';
          }
          if (typeof content === 'object') {
            continue;
          }
          r.push('"' + ('' + content || '').replace(/"/g, '""') + '"');
        }
        c.push(r.join('\t'));
      }
      s = c.join('\n');
      return s;
    },
    copy: function(o){
      var s;
      o == null && (o = {});
      if (!this.les.start) {
        return;
      }
      s = this._toText({
        sel: this.les
      });
      navigator.clipboard.writeText(s);
      if (o.cut) {
        this.sel.cut = {
          start: this.les.start,
          end: this.les.end
        };
        return this.renderSelection(this.sel.cut, {
          cut: true
        });
      }
    },
    eventInScope: function(e){
      return parent(e.target, '.sheet', this.dom.sheet) === this.dom.sheet;
    },
    size: function(it){
      var ref$;
      if (it == null) {
        return this._size;
      }
      this._size = {
        row: (ref$ = import$({
          row: [],
          col: []
        }, it)).row,
        col: ref$.col
      };
      return this.regrid();
    },
    _template: function(t){
      var this$ = this;
      return [
        this.xif[t][1] > 0 ? "repeat(" + this.xif[t][1] + ", max-content)" : '', (function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = this.frozen[t]; i$ < to$; ++i$) {
            results$.push(i$);
          }
          return results$;
        }.call(this)).map(function(it){
          return this$._size[t][it] || "max-content";
        }).join(' '), (function(){
          var i$, to$, results$ = [];
          for (i$ = this.xif[t][2], to$ = this.dim[t]; i$ < to$; ++i$) {
            results$.push(i$);
          }
          return results$;
        }.call(this)).map(function(it){
          return this$._size[t][it + this$.pos[t] - this$.xif[t][1]] || "max-content";
        }).join(' ')
      ].filter(function(it){
        return it;
      }).join(' ');
    },
    regrid: function(){
      this.dom.inner.style.gridTemplateColumns = this._template('col');
      return this.dom.inner.style.gridTemplateRows = this._template('row');
    },
    _viewport: function(){
      var sbox, inner, ret, i$, to$, y, n, x;
      sbox = this.dom.sheet.getBoundingClientRect();
      inner = this.dom.inner;
      ret = {
        row: 0,
        col: 0
      };
      for (i$ = this.xif.row[2], to$ = this.dim.row; i$ < to$; ++i$) {
        y = i$;
        if (!(n = inner.childNodes[y * this.dim.col])) {
          break;
        }
        if (n.getBoundingClientRect().top >= sbox.bottom) {
          break;
        }
        ret.row++;
      }
      for (i$ = this.xif.col[2], to$ = this.dim.col; i$ < to$; ++i$) {
        x = i$;
        if (!(n = inner.childNodes[x])) {
          break;
        }
        if (n.getBoundingClientRect().left >= sbox.right) {
          break;
        }
        ret.col++;
      }
      return ret;
    },
    _dataSize: function(t){
      var ret, i$, ref$, len$, r, i;
      if (t === 'col') {
        ret = 0;
        for (i$ = 0, len$ = (ref$ = this._data).length; i$ < len$; ++i$) {
          r = ref$[i$];
          if (r && r.length > ret) {
            ret = r.length;
          }
        }
        return ret;
      }
      i = this._data.length;
      while (i > 0 && !(this._data[i - 1] || []).length) {
        i--;
      }
      return i;
    },
    _scrollInfo: function(t){
      var vis, total;
      vis = this._viewport()[t];
      total = this._dataSize(t);
      return {
        vis: vis,
        total: total,
        extent: total + vis,
        max: total
      };
    },
    _scrollTo: function(t, v, info){
      var ref$, ref1$, ref2$;
      info == null && (info = this._scrollInfo(t));
      v = (ref$ = (ref1$ = Math.round(v)) < (ref2$ = info.max) ? ref1$ : ref2$) > 0 ? ref$ : 0;
      if (v === this.pos[t]) {
        return;
      }
      return this.goto(t === 'row'
        ? {
          row: v
        }
        : {
          col: v
        });
    },
    _scrollMetric: function(n, info){
      var dim, len, size, ref$, ref1$;
      dim = n === 'y' ? 'height' : 'width';
      len = this.dom["scroll-" + n].getBoundingClientRect()[dim];
      if (!(len > 0) || !(info.extent > 0)) {
        return null;
      }
      size = (ref$ = (ref1$ = len * (info.vis / info.extent)) > 20 ? ref1$ : 20) < len ? ref$ : len;
      return {
        dim: dim,
        len: len,
        size: size,
        span: len - size
      };
    },
    _scrollDrag: function(n, evt){
      var ref$, t, cl, info, m, ref1$, base, start, hm, hu, this$ = this;
      ref$ = n === 'y'
        ? ['row', 'clientY']
        : ['col', 'clientX'], t = ref$[0], cl = ref$[1];
      info = this._scrollInfo(t);
      if (!(m = this._scrollMetric(n, info))) {
        return;
      }
      if (m.span <= 0 || info.max <= 0) {
        return;
      }
      ref$ = [evt[cl], (ref$ = this.pos[t]) < (ref1$ = info.max) ? ref$ : ref1$], base = ref$[0], start = ref$[1];
      hm = function(e){
        return this$._scrollTo(t, start + ((e[cl] - base) / m.span) * info.max, info);
      };
      hu = function(e){
        this$._scrolling = false;
        this$.dom["scroll-" + n].classList.remove('active');
        document.removeEventListener('mousemove', hm);
        return document.removeEventListener('mouseup', hu);
      };
      this._scrolling = true;
      this.dom["scroll-" + n].classList.add('active');
      document.addEventListener('mousemove', hm);
      return document.addEventListener('mouseup', hu);
    },
    renderScrollbar: function(){
      var this$ = this;
      if (!this.scrollbar) {
        return;
      }
      return [['row', 'y', 'top'], ['col', 'x', 'left']].map(function(arg$){
        var t, n, side, ref$, track, thumb, info, m;
        t = arg$[0], n = arg$[1], side = arg$[2];
        ref$ = [this$.dom["scroll-" + n], this$.dom["thumb-" + n]], track = ref$[0], thumb = ref$[1];
        info = this$._scrollInfo(t);
        if (!(m = this$._scrollMetric(n, info))) {
          track.classList.add('idle');
          return;
        }
        track.classList.toggle('idle', info.max <= 0);
        thumb.style[m.dim] = m.size + "px";
        return thumb.style[side] = (info.max <= 0
          ? 0
          : m.span * ((ref$ = this$.pos[t] / info.max) < 1 ? ref$ : 1)) + "px";
      });
    },
    addCell: function(x, y){
      var div;
      div = document.createElement('div');
      this.dom.inner.insertBefore(div, this.dom.inner.childNodes[y * this.dim.col + x]);
      return this._content({
        x: x,
        y: y,
        n: div
      });
    },
    set: function(arg$){
      var row, col, data, range, src, touched, ref$, i$, to$, r, j$, to1$, c, key$;
      row = arg$.row, col = arg$.col, data = arg$.data, range = arg$.range, src = arg$.src;
      if (!range) {
        if (src && this._ccfg && this._ccfg({
          row: row,
          col: col,
          type: 'readonly'
        })) {
          return;
        }
        touched = true;
        ((ref$ = this._data)[row] || (ref$[row] = []))[col] = data;
        this._content({
          y: row - this.pos.row + this.xif.row[1],
          x: col - this.pos.col + this.xif.col[1]
        });
      } else {
        touched = false;
        data = JSON.parse(JSON.stringify(data));
        for (i$ = 0, to$ = data.length; i$ < to$; ++i$) {
          r = i$;
          for (j$ = 0, to1$ = data[r].length; j$ < to1$; ++j$) {
            c = j$;
            if (src && this._ccfg && this._ccfg({
              row: row + r,
              col: col + c,
              type: 'readonly'
            })) {
              data[r][c] = ((ref$ = this._data)[key$ = r + row] || (ref$[key$] = []))[c + col];
              continue;
            }
            touched = true;
            ((ref$ = this._data)[key$ = r + row] || (ref$[key$] = []))[c + col] = data[r][c];
            this._content({
              y: r + row - this.pos.row + this.xif.row[1],
              x: c + col - this.pos.col + this.xif.col[1]
            });
          }
        }
      }
      if (touched) {
        return this.fire('change', {
          row: row,
          col: col,
          data: data,
          range: !!range
        });
      }
    },
    _content: function(arg$){
      var x, y, n, v, ref$, key$, content, className, fr, clsext, clsopt, fc;
      x = arg$.x, y = arg$.y, n = arg$.n;
      if (!n && !(n = this.dom.inner.childNodes[x + y * this.dim.col])) {
        return;
      }
      ref$ = x < this.xif.col[0] && y < this.xif.col[0]
        ? ["", "cell idx"]
        : x < this.xif.col[0]
          ? (v = y < this.xif.row[1]
            ? " "
            : y < this.xif.row[2]
              ? y - this.xif.row[1] + 1
              : y - this.xif.row[1] + this.pos.row + 1, [v, "cell idx"])
          : y < this.xif.row[0]
            ? (v = x < this.xif.col[1]
              ? " "
              : x < this.xif.col[2]
                ? idxToLabel(x - this.xif.col[1])
                : idxToLabel(x - this.xif.col[1] + this.pos.col), [v, "cell idx"])
            : x < this.xif.col[1]
              ? [null, "cell fixed"]
              : y < this.xif.row[1]
                ? [null, "cell fixed"]
                : x < this.xif.col[2] && y < this.xif.row[2]
                  ? [((ref$ = this._data)[key$ = y - this.xif.row[1]] || (ref$[key$] = []))[x - this.xif.col[1]], "cell frozen fixed"]
                  : x < this.xif.col[2]
                    ? [((ref$ = this._data)[key$ = this.pos.row + y - this.xif.row[1]] || (ref$[key$] = []))[x - this.xif.col[1]], "cell frozen"]
                    : y < this.xif.row[2]
                      ? [((ref$ = this._data)[key$ = y - this.xif.row[1]] || (ref$[key$] = []))[this.pos.col + x - this.xif.col[1]], "cell frozen"]
                      : [((ref$ = this._data)[key$ = this.pos.row + y - this.xif.row[1]] || (ref$[key$] = []))[this.pos.col + x - this.xif.col[1]], "cell"], content = ref$[0], className = ref$[1];
      if (!(content != null)) {
        content = "";
      }
      fr = /frozen/.exec(className);
      clsext = x >= this.xif.col[0] && y >= this.xif.row[0] ? (this.cls.col[(fr
        ? 0
        : this.pos.col) + x - this.xif.col[1]] || '') + ' ' + (this.cls.row[(fr
        ? 0
        : this.pos.row) + y - this.xif.row[1]] || '') : '';
      clsopt = !this._ccfg
        ? ''
        : this._ccfg({
          type: 'class',
          col: (fr
            ? 0
            : this.pos.col) + x - this.xif.col[1],
          row: (fr
            ? 0
            : this.pos.row) + y - this.xif.row[1]
        }) || '';
      n.className = [className, clsext, clsopt].filter(function(it){
        return it.trim();
      }).join(' ').trim();
      if (content !== null) {
        if (typeof content === 'object') {
          if (content.type === 'dom') {
            n.textContent = "";
            return n.appendChild(content.node);
          }
        } else {
          if (this._ccfg && !sheet._d3warning && !isNaN(parseFloat(content))) {
            fc = this._ccfg({
              type: 'format',
              col: (fr
                ? 0
                : this.pos.col) + x - this.xif.col[1],
              row: (fr
                ? 0
                : this.pos.row) + y - this.xif.row[1]
            });
            if (fc) {
              if ((typeof d3 != 'undefined' && d3 !== null) && d3.format) {
                content = d3.format(fc)(content);
              } else {
                console.warn("[@plotdb/sheet] cell format provided yet d3.format not available. skip formatting.");
                sheet._d3warning = true;
              }
            }
          }
          return n.textContent = content;
        }
      }
    },
    _md: function(mag){
      var inner, start, ref$, i$, j, j$, to$, i, idx, n;
      mag == null && (mag = 1);
      inner = this.dom.inner;
      mag = Math.round(Math.abs(mag));
      start = (ref$ = mag - (this.dim.row - this.fix.row)) > 0 ? ref$ : 0;
      for (i$ = start; i$ < mag; ++i$) {
        j = i$;
        for (j$ = 0, to$ = this.dim.col; j$ < to$; ++j$) {
          i = j$;
          idx = this.dim.col * this.fix.row;
          if (!inner.childNodes[idx]) {
            break;
          }
          inner.removeChild(inner.childNodes[idx]);
        }
      }
      for (i$ = start; i$ < mag; ++i$) {
        j = i$;
        for (j$ = 0, to$ = this.dim.col; j$ < to$; ++j$) {
          i = j$;
          n = document.createElement('div');
          this._content({
            x: i,
            y: this.dim.row + j,
            n: n
          });
          inner.appendChild(n);
        }
      }
      this.pos.row += mag;
      return this.renderScrollbar();
    },
    _mu: function(mag){
      var inner, start, ref$, i$, j, j$, to$, i, n;
      mag == null && (mag = 1);
      inner = this.dom.inner;
      if (this.pos.row <= 0) {
        return;
      }
      mag = Math.round(Math.abs(mag));
      if (mag >= this.pos.row) {
        mag = this.pos.row;
      }
      start = (ref$ = mag - (this.dim.row - this.xif.row[2])) > 0 ? ref$ : 0;
      for (i$ = start; i$ < mag; ++i$) {
        j = i$;
        for (j$ = 0, to$ = this.dim.col; j$ < to$; ++j$) {
          i = j$;
          if (!inner.childNodes.length) {
            break;
          }
          inner.removeChild(inner.childNodes[inner.childNodes.length - 1]);
        }
      }
      this.pos.row -= mag;
      for (i$ = start; i$ < mag; ++i$) {
        j = i$;
        for (j$ = 0, to$ = this.dim.col; j$ < to$; ++j$) {
          i = j$;
          n = document.createElement('div');
          this._content({
            x: i,
            y: j + this.xif.row[2],
            n: n
          });
          inner.insertBefore(n, inner.childNodes[i + (j - start) * this.dim.col + this.dim.col * this.xif.row[2]]);
        }
      }
      return this.renderScrollbar();
    },
    _mr: function(mag){
      var inner, start, ref$, i$, j, j$, to$, i, n;
      mag == null && (mag = 1);
      inner = this.dom.inner;
      mag = Math.round(Math.abs(mag));
      start = (ref$ = mag - (this.dim.col - this.fix.col)) > 0 ? ref$ : 0;
      for (i$ = start; i$ < mag; ++i$) {
        j = i$;
        for (j$ = 0, to$ = this.dim.row; j$ < to$; ++j$) {
          i = j$;
          inner.removeChild(inner.childNodes[i * this.dim.col + this.fix.col]);
          n = document.createElement('div');
          this._content({
            x: this.dim.col + j,
            y: i,
            n: n
          });
          inner.insertBefore(n, inner.childNodes[(i + 1) * this.dim.col - 1]);
        }
      }
      this.pos.col += mag;
      this.regrid();
      return this.renderScrollbar();
    },
    _ml: function(mag){
      var inner, start, ref$, i$, j, j$, to$, i, n;
      mag == null && (mag = 1);
      inner = this.dom.inner;
      mag = Math.round(Math.abs(mag));
      if (mag >= this.pos.col) {
        mag = this.pos.col;
      }
      if (this.pos.col <= 0 || mag <= 0) {
        return;
      }
      start = (ref$ = mag - (this.dim.col - this.xif.col[2])) > 0 ? ref$ : 0;
      this.pos.col -= mag;
      for (i$ = start; i$ < mag; ++i$) {
        j = i$;
        for (j$ = 0, to$ = this.dim.row; j$ < to$; ++j$) {
          i = j$;
          inner.removeChild(inner.childNodes[(i + 1) * this.dim.col - 1]);
          n = document.createElement('div');
          this._content({
            x: j + this.xif.col[2],
            y: i,
            n: n
          });
          inner.insertBefore(n, inner.childNodes[i * this.dim.col + this.xif.col[2] + j - start]);
        }
      }
      this.regrid();
      return this.renderScrollbar();
    },
    goto: function(opt){
      opt == null && (opt = {
        row: 0,
        col: 0
      });
      import$(this.pos, opt);
      this.regrid();
      return this.render();
    },
    render: function(){
      var i$, to$, y, j$, to1$, x;
      for (i$ = 0, to$ = this.dim.row; i$ < to$; ++i$) {
        y = i$;
        for (j$ = 0, to1$ = this.dim.col; j$ < to1$; ++j$) {
          x = j$;
          this._content({
            x: x,
            y: y
          });
        }
      }
      this.renderSelection();
      return this.renderScrollbar();
    },
    move: function(opt){
      var node, idx, box, sbox, ref$, ns;
      opt == null && (opt = {});
      if (this.editing.on) {
        this.edited();
      }
      if (!(opt.node = this.les.node)) {
        return;
      }
      if (!(node = this.cell(opt))) {
        return;
      }
      idx = this.index(node);
      box = node.getBoundingClientRect();
      sbox = this.dom.sheet.getBoundingClientRect();
      if (box.x + box.width > sbox.x + sbox.width) {
        this._mr(1);
      }
      if (box.y + box.height > sbox.y + sbox.height) {
        this._md(1);
      }
      if (idx.x <= this.frozen.col) {
        if (this.pos.col > 0) {
          this._ml(1);
        } else if (idx.x <= 0) {
          return;
        }
      }
      if (idx.y <= this.frozen.row) {
        if (this.pos.row > 0) {
          this._mu(1);
        } else if (idx.y <= 0) {
          return;
        }
      }
      if (!(node = this.cell(opt)) && !(node = this.cell({
        col: idx.col,
        row: idx.row
      }))) {
        return;
      }
      this.les.node = node;
      if (opt.select) {
        ns = {
          col: (ref$ = this.index(node)).col,
          row: ref$.row
        };
        if (this.les.end === this.les.start) {
          this.les.end = JSON.parse(JSON.stringify(this.les.start));
        }
        if (ns.col < this.les.start.col && (ns.col < this.les.end.col || !(this.les.end.col != null))) {
          (this.les.start.col > this.les.end.col
            ? this.les.end
            : this.les.start).col = ns.col;
        }
        if (ns.row < this.les.start.row && (ns.row < this.les.end.row || !(this.les.end.row != null))) {
          (this.les.start.row > this.les.end.row
            ? this.les.end
            : this.les.start).row = ns.row;
        }
        if (ns.col > this.les.start.col && ns.col > this.les.end.col) {
          (this.les.start.col < this.les.end.col
            ? this.les.end
            : this.les.start).col = ns.col;
        }
        if (ns.row > this.les.start.row && ns.row > this.les.end.row) {
          (this.les.start.row < this.les.end.row
            ? this.les.end
            : this.les.start).row = ns.row;
        }
      } else {
        this.les.start = this.les.end = {
          col: (ref$ = this.index(node)).col,
          row: ref$.row
        };
      }
      return this.renderSelection();
    },
    edit: function(arg$){
      var node, quick, idx, ref$, lbox, box, rbox, sx, sy, v;
      node = arg$.node, quick = arg$.quick;
      if (!this._editing) {
        return;
      }
      idx = this.index(node);
      if (!idx || idx.col < 0 || idx.row < 0) {
        return;
      }
      if (this._ccfg && this._ccfg({
        row: idx.row,
        col: idx.col,
        type: 'readonly'
      })) {
        return;
      }
      ref$ = this.editing;
      ref$.node = node;
      ref$.quick = quick;
      ref$.on = true;
      this.dom.layout.textContent = node.textContent;
      lbox = this.dom.layout.getBoundingClientRect();
      box = node.getBoundingClientRect();
      rbox = this.dom.sheet.getBoundingClientRect();
      ref$ = [this.dom.sheet.scrollLeft, this.dom.sheet.scrollTop], sx = ref$[0], sy = ref$[1];
      ref$ = this.dom.edit.style;
      ref$.left = (box.x - rbox.x + sx - 2) + "px";
      ref$.top = (box.y - rbox.y + sy - 2) + "px";
      ref$.width = "fit-content";
      ref$.height = "fit-content";
      this.dom.edit.classList.toggle('show', true);
      ref$ = this.dom.textarea.style;
      ref$.width = Math.max(lbox.width, box.width + 1) + "px";
      ref$.height = Math.max(lbox.height, box.height + 1) + "px";
      this.dom.textarea.value = v = quick
        ? ''
        : node.textContent || '';
      this.dom.textarea.focus();
      return this.dom.textarea.setSelectionRange(v.length, v.length);
    },
    edited: function(opt){
      var v, ref$;
      opt == null && (opt = {});
      if (!this.editing.on) {
        return;
      }
      if (!opt.cancel) {
        this.set({
          row: this.les.start.row,
          col: this.les.start.col,
          data: v = this.dom.textarea.value || ''
        });
      }
      this.dom.edit.classList.toggle('show', false);
      return ref$ = this.editing, ref$.node = null, ref$.on = false, ref$;
    },
    index: function(node){
      var idx, x, y, col, row;
      idx = Array.from(this.dom.inner.childNodes).indexOf(node);
      if (idx < 0) {
        return null;
      }
      x = idx % this.dim.col;
      y = (idx - x) / this.dim.col;
      if (x < this.xif.col[1]) {
        col = -1;
      } else if (x < this.xif.col[2]) {
        col = x - this.xif.col[1];
      } else {
        col = x - this.xif.col[1] + this.pos.col;
      }
      if (y < this.xif.row[1]) {
        row = -1;
      } else if (y < this.xif.row[2]) {
        row = y - this.xif.row[1];
      } else {
        row = y - this.xif.row[1] + this.pos.row;
      }
      return {
        x: x,
        y: y,
        col: col,
        row: row
      };
    },
    cell: function(opt){
      var r, x, y, ref$, base;
      opt == null && (opt = {});
      r = opt.roughly;
      if (opt.col != null || opt.row != null) {
        if (opt.col < this.frozen.col) {
          x = opt.col;
        } else if (opt.col - this.pos.col < this.frozen.col) {
          if (r) {
            x = this.frozen.col;
          } else {
            return null;
          }
        } else {
          x = opt.col - this.pos.col;
        }
        if (opt.row < this.frozen.row) {
          y = opt.row;
        } else if (opt.row - this.pos.row < this.frozen.row) {
          if (r) {
            y = this.frozen.row;
          } else {
            return null;
          }
        } else {
          y = opt.row - this.pos.row;
        }
        ref$ = [x + this.xif.col[1], y + this.xif.row[1]], x = ref$[0], y = ref$[1];
        if (x < 0 || y < 0 || x >= this.dim.col || y >= this.dim.row) {
          return null;
        }
        return this.dom.inner.childNodes[y * this.dim.col + x];
      } else {
        base = opt.node
          ? this.index(opt.node)
          : {
            y: 0,
            x: 0
          };
        if (!base) {
          return;
        }
        y = base.y + (opt.y || 0);
        x = base.x + (opt.x || 0);
        return this.dom.inner.childNodes[y * this.dim.col + x];
      }
    },
    editing: function(v){
      return !(v != null)
        ? this._editing
        : this._editing = !!v;
    },
    renderSelection: function(sel, o){
      var ref$, sc, ec, sr, er, rbox, c0, c1, c2, c3, c4, c5, b0, b1, b2, b3, b4, b5, x1, y1, colOut, rowOut, x2, y2, w, h, snode, sbox, dom, this$ = this;
      o == null && (o = {});
      if (!sel) {
        sel = this.les;
      }
      if (!sel.start) {
        this.dom.caret.classList.toggle('show', false);
        this.dom.range.classList.toggle('show', false);
        return;
      }
      ref$ = this._bound({
        defined: false,
        sel: sel
      }), sc = ref$.sc, ec = ref$.ec, sr = ref$.sr, er = ref$.er;
      rbox = this.dom.inner.getBoundingClientRect();
      c0 = this.cell({
        col: this.pos.col + this.frozen.col,
        row: this.pos.row + this.frozen.row
      });
      c1 = this.cell({
        col: sc,
        row: sr,
        roughly: true
      });
      c2 = this.cell({
        col: sc,
        row: er,
        roughly: true
      });
      c3 = this.cell({
        col: ec,
        row: sr,
        roughly: true
      });
      c4 = this.cell({
        col: ec,
        row: er,
        roughly: true
      });
      c5 = this.cell({
        col: this.pos.col + this.dim.col - 2,
        row: this.pos.row + this.dim.row - 2
      });
      ref$ = [c0, c1, c2, c3, c4, c5].map(function(it){
        if (it) {
          return it.getBoundingClientRect();
        } else {
          return null;
        }
      }), b0 = ref$[0], b1 = ref$[1], b2 = ref$[2], b3 = ref$[3], b4 = ref$[4], b5 = ref$[5];
      b0.width = 0;
      b0.height = 0;
      x1 = (b1 || b2 || (sc > this.pos.col ? b5 : b0)).x - rbox.x;
      y1 = (b1 || b3 || (sr > this.pos.row ? b5 : b0)).y - rbox.y;
      colOut = ec - this.pos.col < 0;
      rowOut = er - this.pos.row < 0;
      x2 = (b3 || b4 || b5 || b0).x + (colOut
        ? 0
        : (b3 || b4 || b5 || b0).width) - rbox.x;
      y2 = (b2 || b4 || b5 || b0).y + (rowOut
        ? 0
        : (b2 || b4 || b5 || b0).height) - rbox.y;
      w = x2 - x1 + 1;
      h = y2 - y1 + 1;
      if (ec == null) {
        w = this.root.getBoundingClientRect().width;
      }
      if (er == null) {
        h = this.root.getBoundingClientRect().height;
      }
      snode = this.les.node;
      sbox = !snode
        ? null
        : snode.getBoundingClientRect();
      dom = o.cut
        ? this.dom["range-cut"]
        : this.dom.range;
      ref$ = dom.style;
      ref$.left = x1 + "px";
      ref$.top = y1 + "px";
      ref$.width = w + "px";
      ref$.height = h + "px";
      dom.classList.toggle('show', true);
      if (!o.cut) {
        if (sbox) {
          ref$ = this.dom.caret.style;
          ref$.left = (sbox.x - rbox.x - 1) + "px";
          ref$.top = (sbox.y - rbox.y - 1) + "px";
          ref$.width = ((colOut
            ? 0
            : sbox.width) + 2) + "px";
          ref$.height = ((rowOut
            ? 0
            : sbox.height) + 2) + "px";
          ref$.zIndex = sel.start.row + this.xif.row[1] < this.xif.row[2] && sel.start.col + this.xif.col[1] < this.xif.col[2]
            ? 101
            : sel.start.row + this.xif.row[1] < this.xif.row[2] || sel.start.col + this.xif.col[1] < this.xif.col[2] ? 20 : 15;
        }
        this.dom.caret.classList.toggle('show', !!sbox);
      }
      if (this.dom.textarea === document.activeElement) {
        return setTimeout(function(){
          return this$.dom.textarea.focus({
            preventScroll: true
          });
        }, 0);
      }
    },
    data: function(it){
      if (!(it != null)) {
        return this._data;
      }
      this._data = it;
      return this.render();
    },
    sort: function(o){
      var ref$, sc, ec, sr, er, d, this$ = this;
      o == null && (o = {});
      ref$ = this._bound({
        defined: false
      }), sc = ref$.sc, ec = ref$.ec, sr = ref$.sr, er = ref$.er;
      d = this._data.map(function(d, i){
        return {
          d: d,
          i: i
        };
      });
      d.sort(function(a, b){
        if (a.i < this$.frozen.row) {
          if (b.i >= this$.frozen.row) {
            return -1;
          }
        }
        if (b.i < this$.frozen.row) {
          if (a.i >= this$.frozen.row) {
            return 1;
          }
        }
        a = isNaN(+a.d[sc])
          ? a.d[sc]
          : +a.d[sc];
        b = isNaN(+b.d[sc])
          ? b.d[sc]
          : +b.d[sc];
        return (o.dir === 'asc'
          ? 1
          : -1) * (a > b
          ? 1
          : a < b ? -1 : 0);
      });
      this._data = d.map(function(d){
        return d.d;
      });
      this.fire('change', {
        row: 0,
        col: 0,
        data: this._data,
        range: true
      });
      this.renderSelection();
      return this.render();
    },
    insert: function(){
      var ref$, sc, ec, sr, er, d;
      ref$ = this._bound({
        defined: false
      }), sc = ref$.sc, ec = ref$.ec, sr = ref$.sr, er = ref$.er;
      if (ec == null) {
        d = this._data.splice(sr, 0, []);
      }
      if (er == null) {
        d = this._data.map(function(it){
          return it.splice(sc, 0, '');
        });
      }
      this.fire('change', {
        row: sr,
        col: sc,
        data: d,
        range: true
      });
      this.les.end = this.les.start;
      this.renderSelection();
      this.render();
    },
    slice: function(){
      var ref$, sc, ec, sr, er, d;
      ref$ = this._bound({
        defined: false
      }), sc = ref$.sc, ec = ref$.ec, sr = ref$.sr, er = ref$.er;
      if (ec == null) {
        d = this._data.splice(sr, er - sr + 1);
      }
      if (er == null) {
        d = this._data.map(function(it){
          return it.splice(sc, ec - sc + 1);
        });
      }
      this.fire('change', {
        row: sr,
        col: sc,
        data: d,
        range: true
      });
      this.les.end = this.les.start;
      this.renderSelection();
      this.render();
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = sheet;
  } else if (typeof window != 'undefined' && window !== null) {
    window.sheet = sheet;
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
