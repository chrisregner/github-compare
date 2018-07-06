import d3 from 'app/services/d3'

export default (color) => {
  const c = d3.hsl(color)
  c.l += 0.25
  return c.hex()
}
