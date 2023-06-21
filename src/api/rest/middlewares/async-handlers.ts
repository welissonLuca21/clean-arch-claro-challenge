export function asyncHandler(fn) {
  return (req, res, next) => {
    const returnValue = fn(req, res, next)
    return Promise.resolve(returnValue).catch(next)
  }
}
