# Change Logs

## v0.7.5

 - fix bug: `enableScrolling: false` stops the wheel handler but the sheet still swallows
   the scroll. `.sheet` is a scroll container even at `overflow: hidden`, and the
   `overscroll-behavior: contain` guarding against swipe back keeps the gesture from ever
   reaching the page. it now relaxes to `overscroll-behavior-y: auto` while scrolling is
   off, via a `no-scrolling` class. the horizontal axis keeps `contain`, that being the
   axis swipe back lives on, and behaviour with scrolling enabled is unchanged.


## v0.7.4

 - fix bug: a sheet with neither an index nor a fixed row/col renders every track
   collapsed, since `regrid` emits `repeat(0, max-content)` - `repeat()` takes an
   integer of at least 1, so the whole `grid-template-*` declaration is dropped.
 - fix bug: an all empty row collapses, since an empty cell has no line box and
   `.cell` had no `min-height` to fall back on. only visible without an index column,
   whose row number used to be what kept such rows open.
 - add a no index / no fixed example to the demo page.


## v0.7.3

 - fix bug: copying a whole row / column / `select all` includes one extra empty row
   and column, since `_bound` fills in sizes where inclusive indices are expected.
   deleting a whole row used to grow the data by one column every time for the same
   reason.


## v0.7.2

 - support horizontal scrolling with shift + wheel, for mouse with vertical wheel only
 - add `scrollbar` option for optional overlay scrollbars
 - fix bug: `Math.max.apply` over `@_data` gives NaN once `@_data` becomes sparse, which
   happens after scrolling far away. this made `select all` produce a NaN column bound.
 - fix bug: `select all` bound grows as we scroll, since rendering out of range cells
   extends `@_data` with empty rows
 - upgrade dependencies
 - add context dev dependency


## v0.7.1

 - fix bug: pasting HTML table with whitespace/newlines in cell content causes unexpected line breaks due to `white-space: pre`
 - fix bug: row headers collapse and become invisible after deleting all cell content
 - fix bug: `_content` accessing wrong DOM node when pasted data exceeds visible column range
 - fix bug: `cellcfg` option causes exception if non-function value is provided
 - upgrade dev dependencies for vulnerability fixing


## v0.7.0

 - support number formatting based on d3-format


## v0.6.11

 - tweak textarea focus rule to prevent race condition in focus between multiple sheets
 - fix bug: selection moving with arrow keys beyond top / left with frozen cells doesn't work correctly


## v0.6.10

 - add `ctrl` (keycode 17) in the skip list when reacting to keyboard events.


## v0.6.9

 - fix bug: keydown cause exception if selection is out of viewport after scrolled.


## v0.6.8

 - call `focus` with `preventScroll: true` in render-selection to prevent scrolling from non-interaction update.


## v0.6.7

 - skip cell copy/cut if we are editing in textarea to preserve content editing experience.


## v0.6.6

 - add `enableScrolling` option for enabling scrolling which by default is true
 - upgrade dependencies


## v0.6.5

 - tweak scroll controller speed
 - add sample code for overscrolling


## v0.6.4

 - bug fix: check `ccfg` existence before using it


## v0.6.3

 - bug fix: sliders is covered by grid due to z-index issue


## v0.6.2

 - bug fix: change isn't fired when editing


## v0.6.1

 - simplify `opt.cellcfg` to `_ccfg`
 - prevent readonly cells to be edited by paste, cut or delete
 - add `papaparse` in demo page


## v0.6.0

 - optionally disable pasting if `papaparse` is not available (not yet implemented TODO)
 - support slider with `slider` option to toggle it on
 - let `tab` key stroke move cursor one cell forward in x direction.
 - support shift + arrow key to extend selection.
 - fix bug: IME composition isn't working at the first keystroke to enter editing mode.
 - support `cellcfg()` for customizing cells with `readonly` and `class` type.
 - check `Papa` for existency before parsing CSV with papaparse.


## v0.5.9

 - add sorting API


## v0.5.8

 - support html parsing when HTML code is detected in paste event.


## v0.5.7

 - correctly handle ctrl+`+` event for row/col insertion
 - prevent `enter` from sending newline to cell when it's used to toggle editing.


## v0.5.6

 - fix bug: selection out of range isn't rendered correctly if current view is closer to origin point.


## v0.5.5

 - support `menu.on` and `menu.off` event
 - fix bug: right click incorrectly considered as selection.


## v0.5.4

 - add `insert` api


## v0.5.3

 - cell lookup now doesn't throw exception if node not found.
   instead, null returned value is handled by caller
 - fix bug: for narrow table, cell lookup of previous location may fail due to sheet move.
 - trim class name.


## v0.5.2

 - fix bug: exception when slice without selection


## v0.5.1

 - upgrade dev modules and fix vulnerabilities
 - add `slice` api


## v0.5.0

 - add `select` api for set / get selection status
 - add test code for selection in demo page


## v0.4.4

 - fix bug: selection should also be rendered when `render` is called.


## v0.4.3

 - fix bug: selection issue in frozen cell
 - fic bug: row/col based deletion doesn't work when range start out of canvas


## v0.4.2

 - fix bug: selection out of canvas rendered incorrectly


## v0.4.1

 - fix bug: `change` event should be fired for row-wise / col-wise deletion
 - fix bug: `change` event for range update should be fired in one batch


## v0.4.0

 - support in-sheet cut / paste
 - support row-wise / column-wise deletion by ctrl+`-`
 - separate `_to-text` function from `copy`
 - parameterize `render-selection` for possibly future features such as multiple selection


## v0.3.0

 - support shift-select a range
 - support selection from idx cells
 - support selection without boundary


## v0.2.0

 - add `style` in `package.json`
 - add `main` and `browser` field in `package.json`.
 - further minimize generated js file with mangling and compression
 - upgrade modules
 - patch test code to make it work with upgraded modules
 - release with compact directory structure


## v0.1.8

 - add `overscroll-behavior` over `.sheet`
 - swipe back note in README.md


## v0.1.7

 - support resizing after initialization


## v0.1.6

 - support custom class names in cells


## v0.1.5

 - make it possible to add node instead of pure text.


## v0.1.4

 - fix bug: `0` wasn't shown when set cell content. fix this by checking `!(textContent?)` instead of `!(textContent)`.


## v0.1.3

 - add `data(d)` api


## v0.1.2

 - add `scrollLock` option for locking body scrolling to prevent swipe gesture.


## v0.1.1

 - fix bug: escape should cancel editing.
 - fix bug: caret position incorrect after pressing enter.
 - fix bug: should re-focus after enter.
 - fix bug: caret and range should not be hidden after edited.


## v0.1.0

 - rename `update` event to `change` event.
 - check sheet focus before pasting data
 - support copy tsv format text to clipboard. use `navigator.clipboard`, which doesn't support older browsers.


## v0.0.10

 - fix selection issue across frozen cells
 

## v0.0.9

 - fix column label issue (plotdb/sheet#1)


## v0.0.8

 - fix bug: cell overflow should be hidden so content won't overflow and cover following cells if size is fixed.


## v0.0.7

 - support sheet in shadow DOM mode
 - add editing option / api for togglgin editability
 - add size option
 - tweak style for `.fixed.frozen` cell.


## v0.0.6

 - re-focus sheet after selection moved to support quick editing
 - remove outline of sheet to prevent unwanted focus style.
 - tweak code for updating content
 - add event handler
 - fix bug of content updating issue when setting new data
 - fire update event when data is changed.
 - support range in `set` api.


## v0.0.5

 - add `tabindex` in root element to make it possible to capture key events.
 - check some events for event source.


## v0.0.4

 - tweak fixed cell style
 - prevent fixed cell from being edited


## v0.0.3

 - support fixed rows / columns, frozen rows / columns and idx cells toggling


## v0.0.2

 - fix bug: edited failed if edited node is outside range of visible sheet.


## v0.0.1

init commit
