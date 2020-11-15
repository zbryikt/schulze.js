require! <[fs path yargs]>

# example using yargs in livescript: with --
#     lsc dataset-generator.ls -- -o some-file
argv = yargs
  .option \output, do
    alias: \o
    description: "output filename. default to stdout."
    type: \string
  .option \judge-count, do
    alias: \j
    description: "how many judge(s). default 100"
    type: \number
  .option \candidate-count, do
    alias: \c
    description: "how many candidate(s), default 7"
    type: \number
  .option \rank, do
    alias: \r
    description: "generate ranking instead of score. default true"
    type: \boolean
  .option \invalid-rate, do
    alias: \i
    description: "how many vote, in percentage, should be invalid. between 0 ~ 1. default 0.1 "
    type: \number
  .help \help
  .alias \help, \h
  .check (argv, options) -> return true
  .argv

outfile = argv.o
judge-count = if argv.j? => argv.j else 100
candidate-count = if argv.c? => argv.c else 7
use-rank = if argv.r? => arg.r else true
invalid-rate = if argv.i? => argv.i else 0.1

ret = []
console.log (<["judge-name"]> ++ [1 to candidate-count].map (d,i) -> "\"c-#d\"").join(\,)
for i from 1 to judge-count =>
  a = [1 to candidate-count].map -> [Math.random!, it]
  a.sort (a,b) -> a.0 - b.0
  ret.push(
    ["\"j-#{i}\""] ++ a
      .map -> if Math.random! < invalid-rate => '-' else if use-rank => it.1 else Math.round(Math.random! * 100)
      .join \,
  )
ret = ret.join(\\n)
if outfile => 
  fs.ensure-dir-sync path.dirname(outfile)
  fs.write-file-sync outfile, re
else console.log ret
