
import ReactFauxDOM from 'react-faux-dom'
import PropTypes from 'prop-types'
import d3 from 'app/services/d3'
import withContainerWidth from 'app/utils/withContainerWidth'
import lighten from 'app/utils/lighten'
import { compose, withState } from 'recompose'

const HEIGHT = 300
const HIGHLIGHT_WD = 4
const MARGIN = { top: 20, bottom: 10, left: 50, right: 0 }

const BarChart = ({
  candidates,
  inspectedCandidateId,
  toggleClickInspect,
  toggleHoverInspect,
  width,
}) => {
  const innerWd = width - (MARGIN.left + MARGIN.right)
  const innerHt = HEIGHT - (MARGIN.top + MARGIN.bottom)
  const highestValue = candidates.reduce((acc, c) =>
    Math.max(acc, c.value), 0)
  const x = d3.scaleBand()
    .domain(candidates.map(c => c.id))
    .rangeRound([0, innerWd])
  const y = d3.scaleLinear().domain([0, highestValue]).rangeRound([innerHt, 0])

  const svg = ReactFauxDOM.createElement('svg')

  svg.setAttribute('width', '100%')
  svg.setAttribute('height', HEIGHT)

  const gWrapper = d3.select(svg)
    .append('g')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

  // Add y axis
  gWrapper.append('g')
    .call(d3.axisLeft(y))

  // Add candidate entries
  const barWd = (innerWd / 10) * .80
  const gCandidates = gWrapper.append('g')
    .selectAll('g')
    .data(candidates)
    .enter()
    .append('g')
    .on('click', d => d.toggleClickInspect())
    .on('mouseover', d => d.toggleHoverInspect())
    .on('mouseout', d => d.toggleHoverInspect())

  gCandidates.append('rect')
    .attr('width', barWd)
    .attr('height', d => innerHt - y(d.value))
    .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2))
    .attr('y', d => y(d.value))
    .attr('fill', d => d.color)

  gCandidates.append('title')
    .text(d => `${d.id} (click to inspect)`)

  gCandidates.append('text')
    .text(d => d.value)
    .attr('class', 'f7')
    .attr('fill', d =>
      (d.id === inspectedCandidateId) ? '#333' : '#888')
    .style('font-weight', d =>
      (d.id === inspectedCandidateId) ? 'bold' : 'normal')
    .attr('text-anchor', 'middle')
    .attr('x', d => x(d.id) + (x.bandwidth() / 2))
    .attr('y', d => y(d.value) - 5)

  // Add highlights
  gCandidates.filter(d => d.id === inspectedCandidateId)
    .append('rect')
    .attr('fill', 'none')
    .attr('width', barWd + (HIGHLIGHT_WD))
    .attr('height', d => innerHt - y(d.value) + (HIGHLIGHT_WD))
    .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2) - HIGHLIGHT_WD/2)
    .attr('y', d => y(d.value) - HIGHLIGHT_WD/2)
    .attr('stroke-width', HIGHLIGHT_WD)
    .attr('rx', HIGHLIGHT_WD)
    .attr('ry', HIGHLIGHT_WD)
    .attr('stroke', d => lighten(d.color))

  return svg.toReact()
}

BarChart.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    toggleClickInspect: PropTypes.func.isRequired,
    toggleHoverInspect: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  inspectedCandidateId: PropTypes.string,
  width: PropTypes.number.isRequired,
}

export default withContainerWidth(BarChart)