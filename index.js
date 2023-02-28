const config = require("./config")

const fs = require('fs/promises')
const fs1 = require('fs')
const path = require("path")
const io = require("socket.io-client")
const url = require("url")
const Logger = require("./logger")
const CLI = require("./cli")
const requestForwarder = require("./requestForwarder")

let localURL

if (CLI.getValue("setting") != undefined) {
  config.socket.setting = CLI.getValue("setting")
}

async function main() {
  // Read token
  try {
    if (fs1.existsSync(path.join(process.cwd(), "pietunnel_token.txt"))) {
      const token = await fs.readFile(path.join(process.cwd(), "pietunnel_token.txt"), 'utf-8')
      if (token == "") {
        Logger.red("Invalid token.")
        return
      }
      // Check LocalURL
      const u = CLI.getValue("local-url")
      if (u == undefined) {
        Logger.red("LocalURL not defined. Please define a URL to proxy this request to. Example: ... --local-url http://localhost:3000")
        return
      }
      localURL = url.parse(u)
      Logger.log("LocalURL: " + localURL.href)
      createSocket(token)
    } else {
      Logger.log("Please put your authentication token in pietunnel_token.txt, get authentication token at https://pies.cf/panel/tunnels")
      fs.writeFile(path.join(process.cwd(), "pietunnel_token.txt"), "")
      return
    }
  } catch (e) {
    Logger.error("Failed to read token file. Message: " + e.message)
    return
  }
}

function createSocket(token) {
  // Create socket
  const socketSetting = config.socket[config.socket.setting]
  const socket = io(socketSetting.host, {
    path: socketSetting.path
  })

  // Once connected send token
  socket.on("connect", () => {
    socket.emit("auth_token", [ token, config.protocal ])
  })

  // Check accepted
  socket.on("auth_accept", (data) => {
    Logger.green("Tunnel accepted.")
    Logger.green("=> Protocal: " + data[1])
    Logger.green("=> Address: " + data[0])
    Logger.green("=> Forwarding to: " + localURL.href)
  })

  // Check rejected
  socket.on("auth_reject", (data) => {
    Logger.red("Tunnel authentication rejected.")
    Logger.red("=> Reason: " + data)
    process.exit()
  })

  socket.on("message", (message) => {
    Logger.log(`(Message) ${message}`)
  })

  requestForwarder(socket, localURL)
}

main()