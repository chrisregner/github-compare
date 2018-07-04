
import ReactFauxDOM from 'react-faux-dom'
import PropTypes from 'prop-types'
import d3 from 'app/services/d3'
import withContainerWidth from 'app/utils/withContainerWidth'

const HEIGHT = 300

const BarChart = ({ candidates, width }) => {
  const margin = { top: 0, bottom: 50, left: 50, right: 0 }
  const chartWd = width - (margin.left + margin.right)
  const chartHt = HEIGHT - (margin.top + margin.bottom)
  const highestStars = candidates.reduce((acc, c) =>
    Math.max(acc, c.stargazerCount), 0)

  const svg = ReactFauxDOM.createElement('svg')
  const g = d3.select(svg)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  const x = d3.scaleBand()
    .domain(candidates.map(c => c.nameWithOwner))
    .rangeRound([0, chartWd])
    .padding(.2)
  const y = d3.scaleLinear().domain([0, highestStars]).rangeRound([chartHt, 0])

  svg.setAttribute('width', '100%')
  svg.setAttribute('height', HEIGHT)

  g.append('g')
      .attr('transform', 'translate(0,' + chartHt + ')')
      .call(d3.axisBottom(x))

  g.append('g')
      .call(d3.axisLeft(y))

  g.append('g')
    .selectAll('rect')
    .data(candidates)
    .enter()
    .append('rect')
    .attr('width', x.bandwidth())
    .attr('height', d => chartHt - y(d.stargazerCount))
    .attr('x', d => x(d.nameWithOwner))
    .attr('y', d => y(d.stargazerCount))
    .attr('fill', '#3498db')

  return svg.toReact()
}

BarChart.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    stargazerCount: PropTypes.number.isRequired,
  })).isRequired,
  width: PropTypes.number.isRequired,
}

export default withContainerWidth(BarChart)