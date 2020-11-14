judge-count = 100
candidate-count = 7
use-rank = true
omit-rate = 0.1

ret = []
for i from 0 til judge-count =>
  a = [1 to candidate-count].map -> [Math.random!, it]
  a.sort (a,b) -> a.0 - b.0
  ret.push
    a
      .map -> if Math.random! < omit-rate => '-' else if use-rank => it.1 else Math.round(Math.random! * 100)
      .join \,


