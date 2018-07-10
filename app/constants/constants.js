import * as d3 from 'd3'
import lighten from 'app/utils/lighten'

const colors = d3.schemeCategory10.map(lighten(0.0375))
colors[8] = '#ffd43b'

export { colors }
