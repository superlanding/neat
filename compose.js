export default function compose(...fns) {
  return arg => fns.reduce((res, fn) => fn(res), arg)
}
