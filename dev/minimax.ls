minimax = ({data, candidates, judges}) ->
  size = candidates.length
  d = for i from 0 til size => for j from 0 til size => 0
  d2 = for i from 0 til size => for j from 0 til size => 0
  for judge in judges =>
    rank = data[judge]
    for i from 0 til size => for j from 0 til size => if rank[i] < rank[j] => d2[i][j]++
  for i from 0 til size => for j from 0 til size => d[i][j] = d2[i][j] - d2[j][i]
  [mxs,mins] = [[],[]]
  remains = [0 til size]
  for k from 0 til size =>
    if !remains.length => break
    [min, mx] = [judges.length, []]
    for x in remains =>
      [max,my] = [0,0]
      for y in remains => if x != y and max < d[y][x] => [max, my] = [d[y][x], y]
      if max < min => [min,mx] = [max, [x]]
      else if max == min => mx.push x
    remains = remains.filter -> !(it in mx)
    mxs.push mx
    mins.push min

  [rank,detail,r] = [[],[],1]
  for i from 0 til mxs.length =>
    mxs[i].map (d) -> rank.push { rank: r, idx: d, count: mins[i], name: candidates[d] }
    r = r + mxs[i].length

  for i from 0 til size =>
    list = [rank[i].rank, rank[i].name] ++ [d[rank[i].idx][rank[j].idx] for j from 0 til size]
    detail.push list

  return {rank, detail}
