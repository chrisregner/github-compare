import React from 'react'
import { pure } from 'recompose'

export default (Component) => {
  const PureComponent = pure(Component)

  return class ContainerWidthTracker extends React.Component {
    state = {}

    componentDidMount() {
      this.setState({
        propsWhenLastTracked: this.props,
        width: this.containerRef.offsetWidth,
      })
    }

    componentDidUpdate() {
      if (this.props !== this.state.propsWhenLastTracked) {
        this.setState({
          propsWhenLastTracked: this.props,
          width: this.containerRef.offsetWidth,
        })
      }
    }

    setContainerRef = (containerNode) => {
      this.containerRef = containerNode
    }

    render() {
      const props = this.props === this.state.propsWhenLastTracked
        ? this.props
        : this.state.propsWhenLastTracked

      return <div ref={this.setContainerRef}>
        {this.state.width ? <PureComponent {...props} width={this.state.width} /> : null}
      </div>
    }
  }
}