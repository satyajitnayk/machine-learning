const featuresFunctions = {}

featuresFunctions.getPathCount = (paths) => {
  return paths.length
}


featuresFunctions.getPointCount = (paths) => {
  const points = paths.flat()
  return points.length
}

if (typeof module !== "undefined") {
  module.exports = featuresFunctions
}
