module.exports = class CLI {
  static getValue(x) {
    const index = process.argv.indexOf("--" + x)
    if (index == -1) return null
    const value = process.argv[index + 1]
    if (value == undefined) return null
    return value
  }
}