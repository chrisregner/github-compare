const debounce = (fn, duration) => {
  let timeoutId

  return (...args) => {
    if (timeoutId) window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(fn.bind(null, ...args), duration)
  }
}

export default debounce
