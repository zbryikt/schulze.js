for i from 0 til 100 =>
  a = [1 to 7].map -> [Math.random!, it]
  a.sort (a,b) -> a.0 - b.0
  console.log a.map(->if Math.random! < 0.1 => '-' else it.1).join \,

