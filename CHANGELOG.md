# Change Log

## v0.2.3

 - add `explain` / `toExplanation` / `path` - explain how a candidate ended up at its
   rank, including the chain of wins behind a candidate that beats it despite losing
   the head to head. `pred` was computed but never read until now.
 - demo site: click a row in the pairwise matrix to see that explanation drawn out.
   the default dataset now shows an indirect win, which the old one did not.
 - demo site: both sheets take `enableScrolling: false`, so the wheel goes to the page
   and the grids are scrolled by their own scrollbars instead of swallowing the gesture.
   `@plotdb/sheet` relaxes `overscroll-behavior-y` by itself once scrolling is off, so
   nothing is needed here beyond the option - `.sheet` is a scroll container even at
   `overflow: hidden`, and the `contain` it ships against swipe back would otherwise
   keep the scroll from ever reaching the page.
 - fix `npm test`: `test/index.ls` still required `../src/schulze` after the rename
   to `src/index.ls`, and mocha reports that as `ERR_UNKNOWN_FILE_EXTENSION`.


## v0.2.2

 - upgrade `mocha` and `mochawesome` for vulnerabilities fixing
 - fix `main` field in package.json - it still pointed to the pre-v0.2.0 `dist/schulze.js`,
   which made `require("schulze.js")` fail.
 - treat empty / null cells as unranked instead of score 0. `isNaN` alone let `''` and `null`
   through as a valid score of 0.
 - fix PapaParse lookup in browser - its UMD global is `Papa`, not `papaparse`.
 - `toGrid()` no longer throws when called without an option.
 - fix quote escaping in `toCsv` - `"` in a candidate name is now doubled per RFC 4180.
 - expose the `invalidType` import option, and throw on an unknown value instead of
   silently producing an empty pairwise preference matrix.
 - demo site: replace Handsontable with `@plotdb/sheet`.


## v0.2.1

 - add synchronized version `fromArray` api.


## v0.2.0

 - upgrade dependencies to fix vulnerabilities
 - use `index.js` and `index.min.js` as the default lib file name


## v0.1.0

 - rewrite schulze.ls based on the original Schulze Method paper
 - redesign API and options
 - add more test cases


## v0.0.2

 - add 2 test cases, one generated randomly, one adopted from Wikipedia.
 - add 'showWarning' option. default true.
 - remove `isRank` - just use `higherIsBetter`.
 - update dev packages.
 - add test code
