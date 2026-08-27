# Change Log

## v0.2.2 (upcoming)

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
