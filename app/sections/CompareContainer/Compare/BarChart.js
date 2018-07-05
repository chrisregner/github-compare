
import ReactFauxDOM from 'react-faux-dom'
import PropTypes from 'prop-types'
import d3 from 'app/services/d3'
import withContainerWidth from 'app/utils/withContainerWidth'

const HEIGHT = 300

const BarChart = ({ candidates, width }) => {
  const margin = { top: 10, bottom: 10, left: 50, right: 0 }
  const chartWd = width - (margin.left + margin.right)
  const chartHt = HEIGHT - (margin.top + margin.bottom)
  const highestValue = candidates.reduce((acc, c) =>
    Math.max(acc, c.value), 0)

  const svg = ReactFauxDOM.createElement('svg')
  const g = d3.select(svg)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  const colors = d3.schemeCategory10
  const x = d3.scaleBand()
    .domain(candidates.map(c => c.id))
    .rangeRound([0, chartWd])
  const y = d3.scaleLinear().domain([0, highestValue]).rangeRound([chartHt, 0])
  const barWd = (chartWd / 10) * .80

  svg.setAttribute('width', '100%')
  svg.setAttribute('height', HEIGHT)

  g.append('g')
      .call(d3.axisLeft(y))

  g.append('g')
    .selectAll('rect')
    .data(candidates)
    .enter()
    .append('rect')
    .attr('width', barWd)
    .attr('height', d => chartHt - y(d.value))
    .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2))
    .attr('y', d => y(d.value))
    .attr('fill', (d, i) => colors[i])

  return svg.toReact()
}

BarChart.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  width: PropTypes.number.isRequired,
}

export default withContainerWidth(BarChart)