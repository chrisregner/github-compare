import React from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'

const withContainerWidth = settings => Component => props =>
  <ReactResizeDetector handleWidth {...settings}>
    {width => <Component width={width} {...props} />}
  </ReactResizeDetector>

export const withDebouncedWidth = Component => withContainerWidth()(
  class WithDebouncedWidth extends React.Component {
      state = { debouncedWidth: null, isLoading: true }
      static propTypes = { width: PropTypes.number }

      static getDerivedStateFromProps (props, state) {
        if (props.width && props.width !== state.debouncedWidth)
          return { isLoading: true }
        else
          return null
      }

      componentDidUpdate () {
        if (this.state.isLoading && this.props.width !== this.state.debouncedWidth) {
          if (this.timeout) clearTimeout(this.timeout)

          this.timeout = setTimeout(() => {
            this.setState({ debouncedWidth: this.props.width, isLoading: false })
            this.timeout = null
          }, 500)
        }
      }

      render () {
        const { debouncedWidth, isLoading } = this.state

        return <ReactResizeDetector handleWidth>
          {width =>
            <Component width={debouncedWidth} isLoading={isLoading} {...this.props} />}
        </ReactResizeDetector>
      }
  }
)

export default withContainerWidth
