const compose = (...fns) => {
  return arg => fns.reduce((res, fn) => fn(res), arg)
}

module.exports = compose
