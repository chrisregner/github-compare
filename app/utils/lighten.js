import * as d3 from 'd3'
import * as R from 'ramda'

export default R.curryN(2, (delta, color) => {
  const c = d3.hsl(color)
  c.l += (delta)
  return c.hex()
})
