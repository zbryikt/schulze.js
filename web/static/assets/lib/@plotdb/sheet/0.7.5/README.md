# @plotdb/sheet

simple sheet UI in vanilla JS. Features:

 - fast, infinite scrolling.
 - small - < 25KB when minimized
 - vanilla - only optional depends on Papaparse for CSV parsing
 - CSS-based layout - better user experience
 - size of column/row auto fit content yet still customizable
 - support frozen row/column for data, fixed row/column for custom content
 - support tsv/csv pasting (depends on Papaparse)


## Usage

install:

    npm install @plotdb/sheet


include:

    <script src="path-to/sheet/index.min.js"></script>
    <link rel="stylesheet" type="text/css" href="path-to/sheet/index.min.css"/>
    <div class="container"></div>


initialize:

    var s = new sheet({
      root: '.container',
      data: mydata = [[... ], ... /* array of arrays */]
    })


## Constructor Options

 - `root`: container element or selector.
 - `fixed`: {row, col}. default {row: 0, col: 0}
 - `frozen`: {row, col}. default {row: 0, col: 0}
 - `idx`: {row, col}. default {row: true, col: true}
 - `size`: {row, col}. force cell size, in array by order.
   - default: {row: [], col: []}
   - example: `{col: ["300px", "12em"]}`
 - `class`: {row, col}. additional cell class name, in array by order, as space separated string.
   - default: {row: [], col: []}
 - `editing`: false to disable editing. default true.
   - (TBD) in the future we should be able to:
     - set edit permission ( e.g., edit, comment )
     - apply on range
 - `scrollLock`: default true. prevent from horizontal scrolling of document.body if true.
   - this affects how user interact with sheet with scrolling gestures. check src comment for more information.
   - see also `enableScrolling`
 - `enableScrolling`: default true. enable scrolling if true.
   - the difference between `scrollLock` and `enableScrolling` is that:
     - `scrollLock` is for horizontal scrolling that may conflict with browser gesture.
     - `enableScrolling` is for mouse / trackpad scrolling behavior
   - when false the sheet stops taking the wheel, and lets a vertical scroll started over
     it reach the page instead of holding on to it. pair it with `scrollbar: true` so the
     grid can still be scrolled.
 - `data`: initial data, as array of arrays
 - `slider`: default false. show slider widgets if true.
 - `scrollbar`: default false. show overlay scrollbars if true.
   - scrolling is index based ( we move by cells, not by pixels ), so is the scrollbar.
   - the grid has no hard boundary when moving down / right, so the scrollbar is bound to
     the data plus one page. scrolling beyond it is still allowed - the thumb just sticks
     to the end. the scrollbar hides itself when there is nothing to scroll.
   - dragging the thumb moves the view; clicking on the track pages toward the clicked side.
 - `cellcfg(opt)`: custom cell definition function. return value based on the given `opt`, which contains:
   - `row`: row of the cell to query
   - `col`: col of the cell to query
   - `type`: a string indicating what should we return. it can be:
     - `class`: should return the CSS classes for the given cell
     - `readonly`: return true if the given cell should be readonly.
     - `format`: return cell format for number. Use `d3-format` syntax.
       - depends on `d3.format`. if not available, no formatting will be applied.


## API

 - `set({row, col, data, range})`: set cell data to `data` for cell(s) in row `row` and col `col`.
   - update a range based on 2D array `data` when `range` is true.
 - `goto({row, col})`: set grid view starting from coordinate {row, col}
 - `render()`: force to re-render visible cells
 - `editing(v)`: set edit status to v, or return edit status if v is not provided.
 - `data(d)`: replace data completely with `d` and re-render.
   - return current data if `d` is omitted.
   - `d` is in the same format with the constructor `data` option
 - `size({row, col})`: update grid size.
 - `select(opt)`: set / get selection range
   - if opt is omitted, return current selection status, which is:
     - null, if no selection available.
     - the selection object with fields as below:
       - `col`: index of column. omitted for selecting everything on a row.
       - `colspan`: span of column. will be 1 if omitted 
       - `row`: index of row. omitted for selecting everything on a column.
       - `rowspan`: span of row. will be 1 if omitted 
     - `{}` = the whole table selected, based on the definition of the selection object.
   - otherwise, set selection based on the `opt` selection range object described as above.
 - `slice()`: delete selected rows/columns
 - `insert()`: insert empty row/column at selected location.
 - `sort(opt)`: sort data based on selected column. `opt` is an object with following fields as options:
   - `dir`: direction. either `asc` or `desc`, by default `asc`.
 - `edited(opt)`: force sheet enter non-edit mode. option:
   - `cancel`: default false. if true, cancel current editing and remove content that are going to be inputted.

## Event

use `sheet.on('event-name', callback)` to handle sheet related events, e.g.,

    s = new sheet( ... );
    s.on('change', function({row, col, data, range}) {
      ....
    });


Following are a list of possible events:

 - `change`: fired when some cells are updated. callback function with following options, in object:
   - `row`: base row of the updated cell
   - `col`: base col of the updated cell
   - `data`: data used to update. If it's a 2D array and `range` is true, then cells are updated with values in `data` correspondingly relative to `row` and `col` as the original cell
   - `range`: true if a range of cells are updated.
 - `menu.on`: fired when a `contextmenu` event is fired within sheet. Option is an object with following fields:
   - `evt`: corresponding event object
   - `node`: target node from which this event was fired.
 - `menu.off`: fired when a context menu is expected to dismiss. Option is an object with following fields:
   - `evt`: corresponding event object
   - `node`: target node from which this event was fired.


## Rich Text

You can add more than texts in the grid of the sheet, by having an object with following structure in data:

    {
      type: "data-type",
      ... /* members according to type */
    }

Currently, only `node` type is supported:

    { type: "dom", node: SomeElement }


# Swipe Back Issue

On Chrome in Mac, scrolling left with trackpad with two finger gesture may also triggers swipe back action, which navigate the page back in browsing history. This happens in all websites needing similar actions, including Airtable and Google Spreadsheet.

This may be temporarily solved by setting `overscroll-behavior` to `contain` of the sheet container, however - if swipe back happens once anywhere outside the sheet container, it then always triggered even in sheet container.

If this happens, try setting `overscroll-behavior` to `contain` directly on `body` to see if it may solve this issue.

Reference:

 - https://bugs.chromium.org/p/chromium/issues/detail?id=889846
 - https://bugs.chromium.org/p/chromium/issues/detail?id=862693
 - https://bugs.chromium.org/p/chromium/issues/detail?id=906886
 - https://community.airtable.com/t/3074



## License

MIT
