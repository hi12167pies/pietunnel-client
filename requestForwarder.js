const Logger = require("./logger")
const axios = require("axios").default

module.exports = function(socket, localURL) {
  // handle incoming requests
  socket.on("web-request", async (data) => {
    let { id, headers } = data,
        time = Date.now()

    headers['host'] = localURL.host

    try {
      // request localurl
      const opts = {
        baseURL: localURL.href + data.url,
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
      Logger.red("An error occured forwarding a request: " + e.message)
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
      Logger.log(`[RES] ${data.method} ${data.url} ${response.status} ${Date.now() - time}ms`)
    }
  })
}