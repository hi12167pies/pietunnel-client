const CLI = {}
CLI.get = function(x) {
  const index = process.argv.indexOf("--" + x)
  if (index == -1) return null
  const value = process.argv[index + 1]
  if (value == undefined) return null
  return value
}
// Do not edit this
const config = {
  version: "1.0.0-beta",
  socket: ['http://127.0.0.1/', '/__pies.cf/websocket/public/tunnel/'],
}
const fs = require('fs/promises')
const { version } = config
const path = require("path")
const io = require("socket.io-client")
const axios = require("axios").default
const url = require("url")

main()

async function main() {

  // Log init
  console.log("-----------")
  console.log(`PieTunnel (v${version})`)
  console.log("-----------")
  console.log("")

  let token = null

  try {
    // Get token from the token file
    const tokenFile = await fs.readFile(path.join(process.cwd(), "token.txt"), 'ascii')
    token = tokenFile.slice(tokenFile.indexOf("token=") + "token=".length)
  } catch (e) {
    // If error re-write the file
    console.log(`Error reading token.txt, ${e.message}`)
    console.log(`Writing new default file.`)
    await fs.writeFile(path.join(process.cwd(), "token.txt"), "token=")
    process.exit()
  }

  // Get the forwarded server
  const localURL = CLI.get("local-url")

  if (localURL == null) {
    console.log("No local url provided. Usage / Example: ... --local-url http://127.0.0.1")
    return
  }

  console.log(`Local URL: ${localURL}`)
  console.log("")

  console.log(`Connecting to socket...`)

  const socket = io(config.socket[0], {
    path: config.socket[1]
  })

  let state = false

  // auth user
  socket.on("connect", () => {
    console.log(`connected, sending auth token`)
    socket.emit("auth_token", token)
  })

  socket.on("connect_error", (err) => {
    console.log(`Failed to connect ${err}`)
  })

  socket.on("disconnect", () => {
    console.log(`disconnected`)
  })

  // handle auth reject / accept stages

  socket.on("auth_reject", (r) => {
    console.log("")
    console.log(`Auth rejected. Reason: ${r}`)
    process.exit()
  })

  socket.on("auth_accept", (url) => {
    state = true
    console.log(`Auth accepted. Your tunnel is live on ${url}`)
  })


  // handle incoming requests
  socket.on("web-request", async (data) => {
    const id = data.id

    let time = Date.now()
    let headers = data.headers
    headers['host'] = url.parse(localURL).host
    try {
      // request localurl
      const opts = {
        baseURL: localURL + data.url,
        method: data.method,
        headers,
        responseType: 'arraybuffer',
      }
      if (data.body) opts.data = data.body
      const response = await axios(opts)
      // end
      end(response)
    } catch (e) {
      // if 404 it will throw error, so end if there is a response
      if (e.response) return end(e.response)
      // if error log
      console.log(e)
    }

    // function to end response
    function end(response) {
      // send response
      socket.emit("web-response", {
        id,
        headers: response.headers,
        data: Buffer.from(response.data).toString("base64"),
        status: response.status
      })
      // log out response
      console.log(`[Forwarded Response] ${data.method} ${data.url} ${response.status} ${Date.now() - time}ms ID: ${short(id, 10)}`)
    }
  })
}

function short(string, to) {
  let newStr = string.slice(0, to)
  let l = string.length - newStr.length
  if (l > 0) {
    newStr += ` (+${l} more)`
  }
  return newStr
}
