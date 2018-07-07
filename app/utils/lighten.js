import * as d3 from 'd3'

export default (color) => {
  const c = d3.hsl(color)
  c.l += 0.25
  return c.hex()
}
