const colors = require("colors")

module.exports = class Logger {
  static log(text) {
    console.log(`[${new Date().toLocaleTimeString()}] ${text}`)
  }
  static red(text) {
    console.log(`[${new Date().toLocaleTimeString()}] ${text}`.red)
  }
  static green(text) {
    console.log(`[${new Date().toLocaleTimeString()}] ${text}`.green)
  }
}