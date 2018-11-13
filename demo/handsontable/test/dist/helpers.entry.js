/*!
 * (The MIT License)
 * 
 * Copyright (c) 2012-2014 Marcin Warpechowski
 * Copyright (c) 2015 Handsoncode sp. z o.o. <hello@handsoncode.net>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Version: 6.1.1
 * Release date: 23/10/2018 (built at 22/10/2018 12:11:22)
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 81);
/******/ })
/************************************************************************/
/******/ ({

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _window = __webpack_require__(82);

var _window2 = _interopRequireDefault(_window);

var _common = __webpack_require__(83);

var common = _interopRequireWildcard(_common);

var _jasmine = __webpack_require__(84);

var jasmine = _interopRequireWildcard(_jasmine);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportToWindow = function exportToWindow(helpersHolder) {
  Object.keys(helpersHolder).forEach(function (key) {
    if (key === '__esModule') {
      return;
    }

    if (_window2.default[key] !== void 0) {
      throw Error('Cannot export "' + key + '" helper because this name is already assigned.');
    }

    _window2.default[key] = helpersHolder[key];
  });
};

// Export all helpers to the window.
/* eslint-disable import/no-unresolved */
exportToWindow(common);
exportToWindow(jasmine);

/***/ }),

/***/ 82:
/***/ (function(module, exports) {

module.exports = window;

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.sleep = sleep;
exports.promisfy = promisfy;
exports.handsontableMethodFactory = handsontableMethodFactory;
exports.hot = hot;
exports.handsontable = handsontable;
exports.getHtCore = getHtCore;
exports.getMaster = getMaster;
exports.getTopClone = getTopClone;
exports.getTopLeftClone = getTopLeftClone;
exports.getLeftClone = getLeftClone;
exports.getBottomClone = getBottomClone;
exports.getBottomLeftClone = getBottomLeftClone;
exports.countCells = countCells;
exports.isEditorVisible = isEditorVisible;
exports.isFillHandleVisible = isFillHandleVisible;
exports.getCorrespondingOverlay = getCorrespondingOverlay;
exports.contextMenu = contextMenu;
exports.closeContextMenu = closeContextMenu;
exports.dropdownMenu = dropdownMenu;
exports.closeDropdownMenu = closeDropdownMenu;
exports.dropdownMenuRootElement = dropdownMenuRootElement;
exports.handsontableMouseTriggerFactory = handsontableMouseTriggerFactory;
exports.mouseDoubleClick = mouseDoubleClick;
exports.handsontableKeyTriggerFactory = handsontableKeyTriggerFactory;
exports.keyDownUp = keyDownUp;
exports.keyProxy = keyProxy;
exports.serveImmediatePropagation = serveImmediatePropagation;
exports.autocompleteEditor = autocompleteEditor;
exports.setCaretPosition = setCaretPosition;
exports.autocomplete = autocomplete;
exports.triggerPaste = triggerPaste;
exports.colWidth = colWidth;
exports.rowHeight = rowHeight;
exports.getRenderedValue = getRenderedValue;
exports.getRenderedContent = getRenderedContent;
exports.createNumericData = createNumericData;
exports.Model = Model;
exports.createAccessorForProperty = createAccessorForProperty;
exports.resizeColumn = resizeColumn;
exports.resizeRow = resizeRow;
exports.moveSecondDisplayedRowBeforeFirstRow = moveSecondDisplayedRowBeforeFirstRow;
exports.moveFirstDisplayedRowAfterSecondRow = moveFirstDisplayedRowAfterSecondRow;
exports.swapDisplayedColumns = swapDisplayedColumns;
exports.triggerTouchEvent = triggerTouchEvent;
exports.createSpreadsheetData = createSpreadsheetData;
function sleep() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

  return Promise.resolve({
    then: function then(resolve) {
      setTimeout(resolve, delay);
    }
  });
}

function promisfy(fn) {
  return new Promise(function (resolve, reject) {
    return fn(resolve, reject);
  });
}

/**
 * Calls a method in current Handsontable instance, returns its output
 * @param method
 * @return {Function}
 */
function handsontableMethodFactory(method) {
  return function () {
    var _instance;

    var instance = void 0;

    try {
      instance = spec().$container.handsontable('getInstance');
    } catch (err) {
      /* eslint-disable */
      console.error(err);
      /* eslint-enable */
    }

    if (instance) {
      if (method === 'destroy') {
        spec().$container.removeData();
      }
    } else {
      if (method === 'destroy') {
        return; // we can forgive this... maybe it was destroyed in the test
      }
      throw new Error('Something wrong with the test spec: Handsontable instance not found');
    }

    return (_instance = instance)[method].apply(_instance, arguments);
  };
}

var addHook = exports.addHook = handsontableMethodFactory('addHook');
var alter = exports.alter = handsontableMethodFactory('alter');
var colToProp = exports.colToProp = handsontableMethodFactory('colToProp');
var countCols = exports.countCols = handsontableMethodFactory('countCols');
var countEmptyCols = exports.countEmptyCols = handsontableMethodFactory('countEmptyCols');
var countEmptyRows = exports.countEmptyRows = handsontableMethodFactory('countEmptyRows');
var countRows = exports.countRows = handsontableMethodFactory('countRows');
var countSourceCols = exports.countSourceCols = handsontableMethodFactory('countSourceCols');
var countSourceRows = exports.countSourceRows = handsontableMethodFactory('countSourceRows');
var deselectCell = exports.deselectCell = handsontableMethodFactory('deselectCell');
var destroy = exports.destroy = handsontableMethodFactory('destroy');
var destroyEditor = exports.destroyEditor = handsontableMethodFactory('destroyEditor');
var emptySelectedCells = exports.emptySelectedCells = handsontableMethodFactory('emptySelectedCells');
var getActiveEditor = exports.getActiveEditor = handsontableMethodFactory('getActiveEditor');
var getCell = exports.getCell = handsontableMethodFactory('getCell');
var getCellEditor = exports.getCellEditor = handsontableMethodFactory('getCellEditor');
var getCellMeta = exports.getCellMeta = handsontableMethodFactory('getCellMeta');
var getCellMetaAtRow = exports.getCellMetaAtRow = handsontableMethodFactory('getCellMetaAtRow');
var getCellRenderer = exports.getCellRenderer = handsontableMethodFactory('getCellRenderer');
var getCellsMeta = exports.getCellsMeta = handsontableMethodFactory('getCellsMeta');
var getCellValidator = exports.getCellValidator = handsontableMethodFactory('getCellValidator');
var getColHeader = exports.getColHeader = handsontableMethodFactory('getColHeader');
var getCopyableData = exports.getCopyableData = handsontableMethodFactory('getCopyableData');
var getCopyableText = exports.getCopyableText = handsontableMethodFactory('getCopyableText');
var getData = exports.getData = handsontableMethodFactory('getData');
var getDataAtCell = exports.getDataAtCell = handsontableMethodFactory('getDataAtCell');
var getDataAtCol = exports.getDataAtCol = handsontableMethodFactory('getDataAtCol');
var getDataAtRow = exports.getDataAtRow = handsontableMethodFactory('getDataAtRow');
var getDataAtRowProp = exports.getDataAtRowProp = handsontableMethodFactory('getDataAtRowProp');
var getDataType = exports.getDataType = handsontableMethodFactory('getDataType');
var getInstance = exports.getInstance = handsontableMethodFactory('getInstance');
var getPlugin = exports.getPlugin = handsontableMethodFactory('getPlugin');
var getRowHeader = exports.getRowHeader = handsontableMethodFactory('getRowHeader');
var getSelected = exports.getSelected = handsontableMethodFactory('getSelected');
var getSelectedLast = exports.getSelectedLast = handsontableMethodFactory('getSelectedLast');
var getSelectedRange = exports.getSelectedRange = handsontableMethodFactory('getSelectedRange');
var getSelectedRangeLast = exports.getSelectedRangeLast = handsontableMethodFactory('getSelectedRangeLast');
var getSourceData = exports.getSourceData = handsontableMethodFactory('getSourceData');
var getSourceDataArray = exports.getSourceDataArray = handsontableMethodFactory('getSourceDataArray');
var getSourceDataAtCell = exports.getSourceDataAtCell = handsontableMethodFactory('getSourceDataAtCell');
var getSourceDataAtCol = exports.getSourceDataAtCol = handsontableMethodFactory('getSourceDataAtCol');
var getSourceDataAtRow = exports.getSourceDataAtRow = handsontableMethodFactory('getSourceDataAtRow');
var getValue = exports.getValue = handsontableMethodFactory('getValue');
var loadData = exports.loadData = handsontableMethodFactory('loadData');
var populateFromArray = exports.populateFromArray = handsontableMethodFactory('populateFromArray');
var propToCol = exports.propToCol = handsontableMethodFactory('propToCol');
var removeCellMeta = exports.removeCellMeta = handsontableMethodFactory('removeCellMeta');
var render = exports.render = handsontableMethodFactory('render');
var selectAll = exports.selectAll = handsontableMethodFactory('selectAll');
var selectCell = exports.selectCell = handsontableMethodFactory('selectCell');
var selectCells = exports.selectCells = handsontableMethodFactory('selectCells');
var selectColumns = exports.selectColumns = handsontableMethodFactory('selectColumns');
var selectRows = exports.selectRows = handsontableMethodFactory('selectRows');
var setCellMeta = exports.setCellMeta = handsontableMethodFactory('setCellMeta');
var setDataAtCell = exports.setDataAtCell = handsontableMethodFactory('setDataAtCell');
var setDataAtRowProp = exports.setDataAtRowProp = handsontableMethodFactory('setDataAtRowProp');
var spliceCellsMeta = exports.spliceCellsMeta = handsontableMethodFactory('spliceCellsMeta');
var spliceCol = exports.spliceCol = handsontableMethodFactory('spliceCol');
var spliceRow = exports.spliceRow = handsontableMethodFactory('spliceRow');
var updateSettings = exports.updateSettings = handsontableMethodFactory('updateSettings');
var undo = exports.undo = handsontableMethodFactory('undo');

function hot() {
  return spec().$container.data('handsontable');
}

function handsontable(options) {
  var currentSpec = spec();

  currentSpec.$container.handsontable(options);
  currentSpec.$container[0].focus(); // otherwise TextEditor tests do not pass in IE8

  return currentSpec.$container.data('handsontable');
}

/**
 * As for v. 0.11 the only scrolling method is native scroll, which creates copies of main htCore table inside of the container.
 * Therefore, simple $(".htCore") will return more than one object. Most of the time, you're interested in the original
 * htCore, not the copies made by native scroll.
 *
 * This method returns the original htCore object
 *
 * @returns {jqObject} reference to the original htCore
 */
function getHtCore() {
  return spec().$container.find('.htCore').first();
}

function getMaster() {
  return spec().$container.find('.ht_master');
}

function getTopClone() {
  return spec().$container.find('.ht_clone_top');
}

function getTopLeftClone() {
  return spec().$container.find('.ht_clone_top_left_corner');
}
// for compatybility
// const getCornerClone = getTopLeftClone;

function getLeftClone() {
  return spec().$container.find('.ht_clone_left');
}

function getBottomClone() {
  return spec().$container.find('.ht_clone_bottom');
}

function getBottomLeftClone() {
  return spec().$container.find('.ht_clone_bottom_left_corner');
}

// Rename me to countTD
function countCells() {
  return getHtCore().find('tbody td').length;
}

function isEditorVisible(editableElement) {
  if (editableElement && !(editableElement.hasClass('handsontableInput') || editableElement.hasClass('handsontableEditor'))) {
    throw new Error('Editable element of the editor was not found.');
  }

  var keyProxyHolder = (editableElement || keyProxy()).parent();

  if (keyProxyHolder.size() === 0) {
    return false;
  }
  var css = function css(cssProp) {
    return keyProxyHolder.css(cssProp);
  };

  return css('z-index') !== '-1' && css('top') !== '-9999px' && css('left') !== '-9999px';
}

function isFillHandleVisible() {
  return !!spec().$container.find('.wtBorder.corner:visible').length;
}

function getCorrespondingOverlay(cell, container) {
  var overlay = $(cell).parents('.handsontable');

  if (overlay[0] === container[0]) {
    return $('.ht_master');
  }

  return $(overlay[0]);
}

/**
 * Shows context menu
 */
function contextMenu(cell) {
  var hotInstance = spec().$container.data('handsontable');
  var clickedCell = cell;
  var selected = hotInstance.getSelectedLast();

  if (!selected) {
    hotInstance.selectCell(0, 0);
    selected = hotInstance.getSelectedLast();
  }
  if (!clickedCell) {
    clickedCell = getCell(selected[0], selected[1]);
  }
  var cellOffset = $(clickedCell).offset();

  $(clickedCell).simulate('mousedown', { button: 2 });
  $(clickedCell).simulate('contextmenu', {
    clientX: cellOffset.left - Handsontable.dom.getWindowScrollLeft(),
    clientY: cellOffset.top - Handsontable.dom.getWindowScrollTop()
  });
  // Chrome doesn't call `mouseup`.
  // $(cell).simulate('mouseup', { button: 2 });
}

function closeContextMenu() {
  $(document).simulate('mousedown');
  // $(document).trigger('mousedown');
}

/**
 * Shows dropdown menu
 */
function dropdownMenu(columnIndex) {
  var hotInstance = spec().$container.data('handsontable');
  var th = hotInstance.view.wt.wtTable.getColumnHeader(columnIndex || 0);
  var button = th.querySelector('.changeType');

  if (button) {
    $(button).simulate('mousedown');
    $(button).simulate('click');
  }
}

function closeDropdownMenu() {
  $(document).simulate('mousedown');
}

function dropdownMenuRootElement() {
  var plugin = hot().getPlugin('dropdownMenu');
  var root = void 0;

  if (plugin && plugin.menu) {
    root = plugin.menu.container;
  }

  return root;
}

/**
 * Returns a function that triggers a mouse event
 * @param {String} type Event type
 * @return {Function}
 */
function handsontableMouseTriggerFactory(type, button) {
  return function (element) {
    var handsontableElement = element;

    if (!(handsontableElement instanceof jQuery)) {
      handsontableElement = $(handsontableElement);
    }
    var ev = $.Event(type);
    ev.which = button || 1; // left click by default

    handsontableElement.simulate(type, ev);
  };
}

var mouseDown = exports.mouseDown = handsontableMouseTriggerFactory('mousedown');
var mouseMove = exports.mouseMove = handsontableMouseTriggerFactory('mousemove');
var mouseOver = exports.mouseOver = handsontableMouseTriggerFactory('mouseover');
var mouseUp = exports.mouseUp = handsontableMouseTriggerFactory('mouseup');

function mouseDoubleClick(element) {
  mouseDown(element);
  mouseUp(element);
  mouseDown(element);
  mouseUp(element);
}

var mouseRightDown = exports.mouseRightDown = handsontableMouseTriggerFactory('mousedown', 3);
var mouseRightUp = exports.mouseRightUp = handsontableMouseTriggerFactory('mouseup', 3);

/**
 * Returns a function that triggers a key event
 * @param {String} type Event type
 * @return {Function}
 */
function handsontableKeyTriggerFactory(type) {
  return function (key, extend) {
    var ev = {}; // $.Event(type);
    var keyToTrigger = key;

    if (typeof keyToTrigger === 'string') {
      if (keyToTrigger.indexOf('shift+') > -1) {
        keyToTrigger = keyToTrigger.substring(6);
        ev.shiftKey = true;
      }

      if (keyToTrigger.indexOf('ctrl+') > -1) {
        keyToTrigger = keyToTrigger.substring(5);
        ev.ctrlKey = true;
        ev.metaKey = true;
      }

      switch (keyToTrigger) {
        case 'tab':
          ev.keyCode = 9;
          break;

        case 'enter':
          ev.keyCode = 13;
          break;

        case 'esc':
          ev.keyCode = 27;
          break;

        case 'f2':
          ev.keyCode = 113;
          break;

        case 'arrow_left':
          ev.keyCode = 37;
          break;

        case 'arrow_up':
          ev.keyCode = 38;
          break;

        case 'arrow_right':
          ev.keyCode = 39;
          break;

        case 'arrow_down':
          ev.keyCode = 40;
          break;

        case 'ctrl':
          if (window.navigator.platform.includes('Mac')) {
            ev.keyCode = 91;
          } else {
            ev.keyCode = 17;
          }
          break;

        case 'shift':
          ev.keyCode = 16;
          break;

        case 'backspace':
          ev.keyCode = 8;
          break;

        case 'delete':
          ev.keyCode = 46;
          break;

        case 'space':
          ev.keyCode = 32;
          break;

        case 'x':
          ev.keyCode = 88;
          break;

        case 'c':
          ev.keyCode = 67;
          break;

        case 'v':
          ev.keyCode = 86;
          break;

        case 'a':
          ev.keyCode = 65;
          break;

        default:
          throw new Error('Unrecognised key name: ' + keyToTrigger);
      }
    } else if (typeof keyToTrigger === 'number') {
      ev.keyCode = keyToTrigger;
    }
    //    ev.originalEvent = {}; //needed as long Handsontable searches for event.originalEvent
    $.extend(ev, extend);
    $(document.activeElement).simulate(type, ev);
  };
}

var keyDown = exports.keyDown = handsontableKeyTriggerFactory('keydown');
var keyUp = exports.keyUp = handsontableKeyTriggerFactory('keyup');

/**
 * Presses keyDown, then keyUp
 */
function keyDownUp(key, extend) {
  if (typeof key === 'string' && key.indexOf('shift+') > -1) {
    keyDown('shift');
  }

  keyDown(key, extend);
  keyUp(key, extend);

  if (typeof key === 'string' && key.indexOf('shift+') > -1) {
    keyUp('shift');
  }
}

/**
 * Returns current value of the keyboard proxy textarea
 * @return {String}
 */
function keyProxy() {
  return spec().$container.find('textarea.handsontableInput');
}

function serveImmediatePropagation(event) {
  if ((event !== null || event !== void 0) && (event.isImmediatePropagationEnabled === null || event.isImmediatePropagationEnabled === void 0)) {
    event.stopImmediatePropagation = function () {
      this.isImmediatePropagationEnabled = false;
      this.cancelBubble = true;
    };
    event.isImmediatePropagationEnabled = true;
    event.isImmediatePropagationStopped = function () {
      return !this.isImmediatePropagationEnabled;
    };
  }

  return event;
}

function autocompleteEditor() {
  return spec().$container.find('.handsontableInput');
}

/**
 * Sets text cursor inside keyboard proxy
 */
function setCaretPosition(pos) {
  var el = keyProxy()[0];

  if (el.setSelectionRange) {
    el.focus();
    el.setSelectionRange(pos, pos);
  } else if (el.createTextRange) {
    var range = el.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

/**
 * Returns autocomplete instance
 */
function autocomplete() {
  return spec().$container.find('.autocompleteEditor');
}

/**
 * Triggers paste string on current selection
 */
function triggerPaste(str) {
  spec().$container.data('handsontable').getPlugin('CopyPaste').paste(str);
}

/**
 * Returns column width for HOT container
 * @param $elem
 * @param col
 * @returns {Number}
 */
function colWidth($elem, col) {
  var TR = $elem[0].querySelector('TBODY TR');
  var cell = void 0;

  if (TR) {
    cell = TR.querySelectorAll('TD')[col];
  } else {
    cell = $elem[0].querySelector('THEAD TR').querySelectorAll('TH')[col];
  }

  if (!cell) {
    throw new Error('Cannot find table column of index \'' + col + '\'');
  }

  return cell.offsetWidth;
}

/**
 * Returns row height for HOT container
 * @param $elem
 * @param row
 * @returns {Number}
 */
function rowHeight($elem, row) {
  var TD = void 0;

  if (row >= 0) {
    TD = $elem[0].querySelector('tbody tr:nth-child(' + (row + 1) + ') td');
  } else {
    TD = $elem[0].querySelector('thead tr:nth-child(' + Math.abs(row) + ')');
  }

  if (!TD) {
    throw new Error('Cannot find table row of index \'' + row + '\'');
  }

  return Handsontable.dom.outerHeight(TD);
}

/**
 * Returns value that has been rendered in table cell
 * @param {Number} trIndex
 * @param {Number} tdIndex
 * @returns {String}
 */
function getRenderedValue(trIndex, tdIndex) {
  return spec().$container.find('tbody tr').eq(trIndex).find('td').eq(tdIndex).html();
}

/**
 * Returns nodes that have been rendered in table cell
 * @param {Number} trIndex
 * @param {Number} tdIndex
 * @returns {String}
 */
function getRenderedContent(trIndex, tdIndex) {
  return spec().$container.find('tbody tr').eq(trIndex).find('td').eq(tdIndex).children();
}

/**
 * Create numerical data values for the table
 * @param rowCount
 * @param colCount
 * @returns {Array}
 */
function createNumericData(rowCount, colCount) {
  var rowsMax = typeof rowCount === 'number' ? rowCount : 100;
  var columnsMax = typeof colCount === 'number' ? colCount : 4;
  var rows = [];
  var i = void 0;
  var j = void 0;

  for (i = 0; i < rowsMax; i++) {
    var row = [];

    for (j = 0; j < columnsMax; j++) {
      row.push(i + 1);
    }
    rows.push(row);
  }

  return rows;
}

/**
 * Model factory, which creates object with private properties, accessible by setters and getters.
 * Created for the purpose of testing HOT with Backbone-like Models
 * @param opts
 * @returns {{}}
 * @constructor
 */
function Model(opts) {
  var obj = {};

  var _data = $.extend({
    id: undefined,
    name: undefined,
    address: undefined
  }, opts);

  obj.attr = function (name, value) {
    if (typeof value === 'undefined') {
      return this.get(name);
    }

    return this.set(name, value);
  };

  obj.get = function (name) {
    return _data[name];
  };

  obj.set = function (name, value) {
    _data[name] = value;

    return this;
  };

  return obj;
}
/**
 * Factory which produces an accessor for objects of type "Model" (see above).
 * This function should be used to create accessor for a given property name and pass it as `data` option in column
 * configuration.
 *
 * @param name - name of the property for which an accessor function will be created
 * @returns {Function}
 */
function createAccessorForProperty(name) {
  return function (obj, value) {
    return obj.attr(name, value);
  };
}

function resizeColumn(displayedColumnIndex, width) {
  var $container = spec().$container;
  var $th = $container.find('thead tr:eq(0) th:eq(' + displayedColumnIndex + ')');

  $th.simulate('mouseover');

  var $resizer = $container.find('.manualColumnResizer');
  var resizerPosition = $resizer.position();

  $resizer.simulate('mousedown', {
    clientX: resizerPosition.left
  });

  var delta = width - $th.width() - 2;
  var newPosition = resizerPosition.left + delta;
  $resizer.simulate('mousemove', {
    clientX: newPosition
  });

  $resizer.simulate('mouseup');
}

function resizeRow(displayedRowIndex, height) {
  var $container = spec().$container;
  var $th = $container.find('tbody tr:eq(' + displayedRowIndex + ') th:eq(0)');

  $th.simulate('mouseover');

  var $resizer = $container.find('.manualRowResizer');
  var resizerPosition = $resizer.position();

  $resizer.simulate('mousedown', {
    clientY: resizerPosition.top
  });

  var delta = height - $th.height() - 2;

  if (delta < 0) {
    delta = 0;
  }

  $resizer.simulate('mousemove', {
    clientY: resizerPosition.top + delta
  });

  $resizer.simulate('mouseup');
}

function moveSecondDisplayedRowBeforeFirstRow(container, secondDisplayedRowIndex) {
  var $mainContainer = container.parents('.handsontable').not('[class*=clone]').not('[class*=master]').first();
  var $rowHeaders = container.find('tbody tr th');
  var $firstRowHeader = $rowHeaders.eq(secondDisplayedRowIndex - 1);
  var $secondRowHeader = $rowHeaders.eq(secondDisplayedRowIndex);

  $secondRowHeader.simulate('mouseover');
  var $manualRowMover = $mainContainer.find('.manualRowMover');

  if ($manualRowMover.length) {
    $manualRowMover.simulate('mousedown', {
      clientY: $manualRowMover[0].getBoundingClientRect().top
    });

    $manualRowMover.simulate('mousemove', {
      clientY: $manualRowMover[0].getBoundingClientRect().top - 20
    });

    $firstRowHeader.simulate('mouseover');
    $secondRowHeader.simulate('mouseup');
  }
}

function moveFirstDisplayedRowAfterSecondRow(container, firstDisplayedRowIndex) {
  var $mainContainer = container.parents('.handsontable').not('[class*=clone]').not('[class*=master]').first();
  var $rowHeaders = container.find('tbody tr th');
  var $firstRowHeader = $rowHeaders.eq(firstDisplayedRowIndex);
  var $secondRowHeader = $rowHeaders.eq(firstDisplayedRowIndex + 1);

  $secondRowHeader.simulate('mouseover');
  var $manualRowMover = $mainContainer.find('.manualRowMover');

  if ($manualRowMover.length) {
    $manualRowMover.simulate('mousedown', {
      clientY: $manualRowMover[0].getBoundingClientRect().top
    });

    $manualRowMover.simulate('mousemove', {
      clientY: $manualRowMover[0].getBoundingClientRect().top + 20
    });

    $firstRowHeader.simulate('mouseover');
    $secondRowHeader.simulate('mouseup');
  }
}

function swapDisplayedColumns(container, from, to) {
  var $mainContainer = container.parents('.handsontable').not('[class*=clone]').not('[class*=master]').first();
  var $colHeaders = container.find('thead tr:eq(0) th');
  var $to = $colHeaders.eq(to);
  var $from = $colHeaders.eq(from);

  // Enter the second column header
  $from.simulate('mouseover');
  var $manualColumnMover = $mainContainer.find('.manualColumnMover');

  // Grab the second column
  $manualColumnMover.simulate('mousedown', {
    pageX: $manualColumnMover[0].getBoundingClientRect().left
  });

  // Drag the second column over the first column
  $manualColumnMover.simulate('mousemove', {
    pageX: $manualColumnMover[0].getBoundingClientRect().left - 20
  });

  $to.simulate('mouseover');

  // Drop the second column
  $from.simulate('mouseup');
}

function triggerTouchEvent(type, target, pageX, pageY) {
  var e = document.createEvent('TouchEvent');
  var targetCoords = target.getBoundingClientRect();
  var targetPageX = pageX || parseInt(targetCoords.left + 3, 10);
  var targetPageY = pageY || parseInt(targetCoords.top + 3, 10);
  var touches = void 0;
  var targetTouches = void 0;
  var changedTouches = void 0;

  var touch = document.createTouch(window, target, 0, targetPageX, targetPageY, targetPageX, targetPageY);

  if (type === 'touchend') {
    touches = document.createTouchList();
    targetTouches = document.createTouchList();
    changedTouches = document.createTouchList(touch);
  } else {
    touches = document.createTouchList(touch);
    targetTouches = document.createTouchList(touch);
    changedTouches = document.createTouchList(touch);
  }

  e.initTouchEvent(type, true, true, window, null, 0, 0, 0, 0, false, false, false, false, touches, targetTouches, changedTouches, 1, 0);
  target.dispatchEvent(e);
}

function createSpreadsheetData() {
  var _Handsontable$helper;

  return (_Handsontable$helper = Handsontable.helper).createSpreadsheetData.apply(_Handsontable$helper, arguments);
}

/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.spec = spec;

var _asciiTable = __webpack_require__(85);

/* eslint-disable import/prefer-default-export */
var currentSpec = void 0;

function spec() {
  return currentSpec;
}

function hot() {
  return spec().$container.data('handsontable');
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

// http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
var scrollbarWidth = function calculateScrollbarWidth() {
  var inner = document.createElement('div');

  inner.style.height = '200px';
  inner.style.width = '100%';

  var outer = document.createElement('div');

  outer.style.boxSizing = 'content-box';
  outer.style.height = '150px';
  outer.style.left = '0px';
  outer.style.overflow = 'hidden';
  outer.style.position = 'absolute';
  outer.style.top = '0px';
  outer.style.width = '200px';
  outer.style.visibility = 'hidden';
  outer.appendChild(inner);

  (document.body || document.documentElement).appendChild(outer);
  var w1 = inner.offsetWidth;

  outer.style.overflow = 'scroll';

  var w2 = inner.offsetWidth;

  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  (document.body || document.documentElement).removeChild(outer);

  return w1 - w2;
}();

beforeEach(function () {
  currentSpec = this;

  var matchers = {
    toBeInArray: function toBeInArray() {
      return {
        compare: function compare(actual, expected) {
          return {
            pass: Array.isArray(expected) && expected.indexOf(actual) > -1
          };
        }
      };
    },
    toBeFunction: function toBeFunction() {
      return {
        compare: function compare(actual) {
          return {
            pass: typeof actual === 'function'
          };
        }
      };
    },
    toBeAroundValue: function toBeAroundValue() {
      return {
        compare: function compare(actual, expected, diff) {
          var margin = diff || 1;

          var pass = actual >= expected - margin && actual <= expected + margin;
          var message = 'Expected ' + actual + ' to be around ' + expected + ' (between ' + (expected - margin) + ' and ' + (expected + margin) + ')';

          if (!pass) {
            message = 'Expected ' + actual + ' NOT to be around ' + expected + ' (between ' + (expected - margin) + ' and ' + (expected + margin) + ')';
          }

          return {
            pass: pass,
            message: message
          };
        }
      };
    },

    /**
     * The matcher checks if the passed cell element is contained in the table viewport.
     */
    toBeVisibleInViewport: function toBeVisibleInViewport() {
      return {
        compare: function compare(actual) {
          var viewport = hot().view.wt.wtTable.holder;
          var verticalPosition = actual.offsetTop - viewport.scrollTop + scrollbarWidth + actual.clientHeight;
          var horizontalPosition = actual.offsetLeft - viewport.scrollLeft + scrollbarWidth + actual.clientWidth;

          var pass = verticalPosition < viewport.offsetHeight && verticalPosition > 0 && horizontalPosition < viewport.offsetWidth && horizontalPosition > 0;

          return {
            pass: pass,
            message: 'Expected the element to be visible in the Handsontable viewport'
          };
        }
      };
    },

    /**
     * The matcher checks if the viewport is scrolled in the way that the cell is visible at the top of the viewport.
     */
    toBeVisibleAtTopOfViewport: function toBeVisibleAtTopOfViewport() {
      return {
        compare: function compare(actual) {
          var viewport = hot().view.wt.wtTable.holder;
          var verticalPosition = actual.offsetTop - viewport.scrollTop - 1;

          return {
            pass: verticalPosition === 0,
            message: 'Expected the element to be scrolled to the top of the Handsontable viewport'
          };
        }
      };
    },

    /**
     * The matcher checks if the viewport is scrolled in the way that the cell is visible at the bottom of the viewport.
     */
    toBeVisibleAtBottomOfViewport: function toBeVisibleAtBottomOfViewport() {
      return {
        compare: function compare(actual) {
          var viewport = hot().view.wt.wtTable.holder;
          var verticalPosition = actual.offsetTop - viewport.scrollTop + scrollbarWidth + actual.clientHeight + 1;

          return {
            pass: verticalPosition === viewport.offsetHeight,
            message: 'Expected the element to be scrolled to the bottom of the Handsontable viewport'
          };
        }
      };
    },

    /**
     * The matcher checks if the viewport is scrolled in the way that the cell is visible on the left of the viewport.
     */
    toBeVisibleAtLeftOfViewport: function toBeVisibleAtLeftOfViewport() {
      return {
        compare: function compare(actual) {
          var viewport = hot().view.wt.wtTable.holder;
          var horizontalPosition = viewport.scrollLeft - actual.offsetLeft;

          return {
            pass: horizontalPosition === 0,
            message: 'Expected the element to be scrolled to the top of the Handsontable viewport'
          };
        }
      };
    },

    /**
     * The matcher checks if the viewport is scrolled in the way that the cell is visible on the right of the viewport.
     */
    toBeVisibleAtRightOfViewport: function toBeVisibleAtRightOfViewport() {
      return {
        compare: function compare(actual) {
          var viewport = hot().view.wt.wtTable.holder;
          var horizontalPosition = viewport.scrollLeft - actual.offsetLeft + actual.clientWidth - scrollbarWidth + 1;

          return {
            pass: horizontalPosition === viewport.offsetWidth,
            message: 'Expected the element to be scrolled to the top of the Handsontable viewport'
          };
        }
      };
    },
    toBeListFulfillingCondition: function toBeListFulfillingCondition() {
      var redColor = '\x1b[31m';
      var resetColor = '\x1b[0m';

      return {
        compare: function compare(checkedArray, conditionFunction) {
          if (typeof conditionFunction !== 'function') {
            throw Error('Parameter passed to `toBeListFulfillingCondition` should be a function.');
          }

          var isListWithValues = Array.isArray(checkedArray) || checkedArray.length > 0;
          var elementNotFulfillingCondition = checkedArray.find(function (element) {
            return !conditionFunction(element);
          });
          var containsUndefined = isListWithValues && checkedArray.includes(undefined);
          var pass = isListWithValues && !containsUndefined && elementNotFulfillingCondition === undefined;
          var message = void 0;

          if (!isListWithValues) {
            message = 'Non-empty list should be passed as expect parameter.';
          } else if (containsUndefined) {
            message = 'List ' + redColor + checkedArray.join(', ') + resetColor + ' contains ' + redColor + 'undefined' + resetColor + ' value.';
          } else if (elementNotFulfillingCondition !== undefined) {
            var entityValue = elementNotFulfillingCondition;

            if (typeof elementNotFulfillingCondition === 'string') {
              entityValue = '"' + elementNotFulfillingCondition + '"';
            }

            message = 'Entity ' + redColor + entityValue + resetColor + ', from list: ' + redColor + checkedArray.join(', ') + resetColor + ' doesn\'t satisfy the condition.';
          }

          return {
            pass: pass,
            message: message
          };
        }
      };
    },

    /**
     * The matcher checks if the provided selection pattern matches to the rendered cells by checking if
     * the appropriate CSS class name was added.
     *
     * The provided structure should be passed as an array of arrays, for instance:
     * ```
     * // Non-contiguous selection (with enabled top and left headers)
     * expect(`
     *   |   ║   :   : * : * |
     *   |===:===:===:===:===|
     *   | - ║   :   : A : 0 |
     *   | - ║   : 1 : 0 : 0 |
     *   | - ║   : 2 : 1 : 0 |
     *   | - ║   : 2 : 1 : 0 |
     *   | - ║   : 1 : 1 : 0 |
     *   | - ║   :   : 0 : 0 |
     *   `).toBeMatchToSelectionPattern();
     * // Single cell selection (with fixedRowsTop: 1 and fixedColumnsLeft: 2)
     * expect(`
     *   |   :   |   :   :   |
     *   |---:---:---:---:---|
     *   |   :   |   :   :   |
     *   |   :   |   :   :   |
     *   |   :   | # :   :   |
     *   |   :   |   :   :   |
     *   |   :   |   :   :   |
     *   |   :   |   :   :   |
     *   `).toBeMatchToSelectionPattern();
     * ```
     *
     * The meaning of the symbol used to describe the cells:
     * ' ' - An empty space indicates cell which doesn't have added any selection classes.
     * '0' - The number (from 0 to 7) indicates selected layer level.
     * 'A' - The letters (from A to H) indicates the position of the cell which contains the hidden editor
     *       (which `current` class name). The letter `A` indicates the currently selected cell with
     *       a background of the first layer and `H` as the latest layer (most dark).
     * '#' - The hash symbol indicates the currently selected cell without changed background color.
     *
     * The meaning of the symbol used to describe the table:
     * ':'   - Column separator (only for better visual looks).
     * '║'   - This symbol separates the row headers from the table content.
     * '===' - This symbol separates the column headers from the table content.
     * '|'   - The symbol which indicates the left overlay edge.
     * '---' - The symbol which indicates the top overlay edge.
     */
    toBeMatchToSelectionPattern: function toBeMatchToSelectionPattern() {
      return {
        compare: function compare(actualPattern) {
          var asciiTable = (0, _asciiTable.generateASCIITable)(hot().rootElement);

          var patternParts = (actualPattern || '').split(/\n/);
          var redundantPadding = patternParts.reduce(function (padding, line) {
            var trimmedLine = line.trim();
            var nextPadding = padding;

            if (trimmedLine) {
              var currentPadding = line.search(/\S|$/);

              if (currentPadding < nextPadding) {
                nextPadding = currentPadding;
              }
            }

            return nextPadding;
          }, Infinity);

          var normalizedPattern = patternParts.reduce(function (acc, line) {
            var trimmedLine = line.trim();

            if (trimmedLine) {
              acc.push(line.substr(redundantPadding));
            }

            return acc;
          }, []);

          var actualAsciiTable = normalizedPattern.join('\n');
          var message = 'Expected the pattern selection \n' + actualAsciiTable + '\nto match to the visual state of the rendered selection \n' + asciiTable + '\n';

          return {
            pass: asciiTable === actualAsciiTable,
            message: message
          };
        }
      };
    }
  };

  jasmine.addMatchers(matchers);

  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  } else if (!document.activeElement) {
    // IE
    document.body.focus();
  }
});

afterEach(function () {
  window.scrollTo(0, 0);
});

/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.generateASCIITable = generateASCIITable;
/* eslint-disable import/prefer-default-export */
var $ = function $(selector) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return context.querySelector(selector);
};

/**
 * Return ASCII symbol for headers depends on what the class name HTMLTableCellElement has.
 *
 * @param {HTMLTableCellElement} cell
 * @return {String} Returns '   ', ` * ` or ' - '.
 */
function getSelectionSymbolForHeader(cell) {
  var hasActiveHeader = cell.classList.contains('ht__active_highlight');
  var hasHighlight = cell.classList.contains('ht__highlight');

  var symbol = '   ';

  if (hasActiveHeader) {
    symbol = ' * ';
  } else if (hasHighlight) {
    symbol = ' - ';
  }

  return symbol;
}

/**
 * Return ASCII symbol for cells depends on what the class name HTMLTableCellElement has.
 *
 * @param {HTMLTableCellElement} cell
 * @return {String} Returns valid symbol for the pariticaul cell.
 */
function getSelectionSymbolForCell(cell) {
  var hasCurrent = cell.classList.contains('current');
  var hasArea = cell.classList.contains('area');
  var areaLevel = new Array(7).fill().map(function (_, i, arr) {
    return 'area-' + (arr.length - i);
  }).find(function (className) {
    return cell.classList.contains(className);
  });

  areaLevel = areaLevel ? parseInt(areaLevel.replace('area-', ''), 10) : areaLevel;

  var symbol = '   ';

  if (hasCurrent && hasArea && areaLevel) {
    symbol = ' ' + String.fromCharCode(65 + areaLevel) + ' ';
  } else if (hasCurrent && hasArea && areaLevel === void 0) {
    symbol = ' A ';
  } else if (hasCurrent && !hasArea && areaLevel === void 0) {
    symbol = ' # ';
  } else if (!hasCurrent && hasArea && areaLevel === void 0) {
    symbol = ' 0 ';
  } else if (!hasCurrent && hasArea && areaLevel) {
    symbol = ' ' + areaLevel + ' ';
  }

  return symbol;
}

/**
 * Generate ASCII symbol for passed cell element.
 *
 * @param {HTMLTableCellElement} cell
 * @return {String}
 */
function getSelectionSymbol(cell) {
  if (isLeftHeader(cell) || isTopHeader(cell)) {
    return getSelectionSymbolForHeader(cell);
  }

  return getSelectionSymbolForCell(cell);
}

/**
 * Check if passed element belong to the left header.
 *
 * @param {HTMLTableCellElement} cell
 * @return {Boolean}
 */
function isLeftHeader(cell) {
  return cell.tagName === 'TH' && cell.parentElement.parentElement.tagName === 'TBODY';
}

/**
 * Check if passed element belong to the rop header.
 *
 * @param {HTMLTableCellElement} cell
 * @return {Boolean}
 */
function isTopHeader(cell) {
  return cell.tagName === 'TH' && cell.parentElement.parentElement.tagName === 'THEAD';
}

/**
 * @param {HTMLTableElement} overlay
 * @return {Function}
 */
function cellFactory(overlay) {
  return function (row, column) {
    return overlay && overlay.rows[row] && overlay.rows[row].cells[column];
  };
}

/**
 * Generates table based on Handsontable structure.
 *
 * @param {HTMLElement} context The root element of the Handsontable instance to be generated.
 * @return {String}
 */
function generateASCIITable(context) {
  var TABLE_EDGES_SYMBOL = '|';
  var COLUMN_SEPARATOR = ':';
  var ROW_HEADER_SEPARATOR = '\u2551';
  var COLUMN_HEADER_SEPARATOR = '===';
  var ROW_OVERLAY_SEPARATOR = '|';
  var COLUMN_OVERLAY_SEPARATOR = '---';

  var cornerOverlayTable = $('.ht_clone_top_left_corner .htCore', context);
  var leftOverlayTable = $('.ht_clone_left .htCore', context);
  var topOverlayTable = $('.ht_clone_top .htCore', context);
  var masterTable = $('.ht_master .htCore', context);
  var stringRows = [];

  var cornerOverlayCells = cellFactory(cornerOverlayTable);
  var leftOverlayCells = cellFactory(leftOverlayTable);
  var topOverlayCells = cellFactory(topOverlayTable);
  var masterCells = cellFactory(masterTable);

  var hasLeftHeader = leftOverlayCells(1, 0) ? isLeftHeader(leftOverlayCells(1, 0)) : false;
  var hasTopHeader = topOverlayCells(0, 1) ? isTopHeader(topOverlayCells(0, 1)) : false;
  var hasCornerHeader = hasLeftHeader && hasTopHeader;
  var hasFixedLeftCells = leftOverlayCells(1, 1) ? !isLeftHeader(leftOverlayCells(1, 1)) : false;
  var hasFixedTopCells = topOverlayCells(1, 1) ? !isTopHeader(topOverlayCells(1, 1)) : false;

  var consumedFlags = new Map([['hasLeftHeader', hasLeftHeader], ['hasTopHeader', hasTopHeader], ['hasCornerHeader', hasCornerHeader], ['hasFixedLeftCells', hasFixedLeftCells], ['hasFixedTopCells', hasLeftHeader]]);

  var rowsLength = masterTable.rows.length;

  for (var r = 0; r < rowsLength; r++) {
    var stringCells = [];
    var columnsLength = masterTable.rows[0].cells.length;
    var isLastColumn = false;
    var insertTopOverlayRowSeparator = false;

    for (var c = 0; c < columnsLength; c++) {
      var cellSymbol = void 0;
      var separatorSymbol = COLUMN_SEPARATOR;

      isLastColumn = c === columnsLength - 1;

      if (cornerOverlayCells(r, c)) {
        var cell = cornerOverlayCells(r, c);
        var nextCell = cornerOverlayCells(r, c + 1);

        cellSymbol = getSelectionSymbol(cell);

        if (isLeftHeader(cell) && (!nextCell || !isLeftHeader(nextCell))) {
          separatorSymbol = ROW_HEADER_SEPARATOR;
        }
        if (!isLeftHeader(cell) && !nextCell) {
          separatorSymbol = ROW_OVERLAY_SEPARATOR;
        }
        if (r === 0 && c === 0 && hasCornerHeader) {
          // Fix for header symbol
          separatorSymbol = ROW_HEADER_SEPARATOR;
        }
      } else if (leftOverlayCells(r, c)) {
        var _cell = leftOverlayCells(r, c);
        var _nextCell = leftOverlayCells(r, c + 1);

        cellSymbol = getSelectionSymbol(_cell);

        if (isLeftHeader(_cell) && (!_nextCell || !isLeftHeader(_nextCell))) {
          separatorSymbol = ROW_HEADER_SEPARATOR;
        }
        if (!isLeftHeader(_cell) && !_nextCell) {
          separatorSymbol = ROW_OVERLAY_SEPARATOR;
        }
      } else if (topOverlayCells(r, c)) {
        var _cell2 = topOverlayCells(r, c);

        cellSymbol = getSelectionSymbol(_cell2);

        if (hasFixedTopCells && isLastColumn && !topOverlayCells(r + 1, c)) {
          insertTopOverlayRowSeparator = true;
        }
      } else if (masterCells(r, c)) {
        var _cell3 = masterCells(r, c);

        cellSymbol = getSelectionSymbol(_cell3);
      }

      stringCells.push(cellSymbol);

      if (!isLastColumn) {
        stringCells.push(separatorSymbol);
      }
    }

    stringRows.push(TABLE_EDGES_SYMBOL + stringCells.join('') + TABLE_EDGES_SYMBOL);

    if (consumedFlags.get('hasTopHeader')) {
      consumedFlags.delete('hasTopHeader');
      stringRows.push(TABLE_EDGES_SYMBOL + new Array(columnsLength).fill(COLUMN_HEADER_SEPARATOR).join(COLUMN_SEPARATOR) + TABLE_EDGES_SYMBOL);
    }
    if (insertTopOverlayRowSeparator) {
      insertTopOverlayRowSeparator = false;
      stringRows.push(TABLE_EDGES_SYMBOL + new Array(columnsLength).fill(COLUMN_OVERLAY_SEPARATOR).join(COLUMN_SEPARATOR) + TABLE_EDGES_SYMBOL);
    }
  }

  return stringRows.join('\n');
}

/***/ })

/******/ });
//# sourceMappingURL=helpers.entry.js.map