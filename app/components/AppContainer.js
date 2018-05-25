import { connect } from 'react-redux'
import { compose, withStateHandlers } from 'recompose'
import App from './App'
import {
  selectRepos,
  selectError,
  selectStep,
  searchRepos,
} from '../state/reducer'

const AppContainer = compose(
  connect(
    state => ({
      repos: selectRepos(state),
      error: selectError(state),
      step: selectStep(state),
    }),
    { searchRepos }
  ),

  withStateHandlers(
    { inputValue: '' },
    {
      updateInputValue: (state, props) => (inputValue) => {
        props.searchRepos(inputValue.trim())
        return { inputValue: inputValue }
      },
    }
  )
)(App)

export default AppContainer
