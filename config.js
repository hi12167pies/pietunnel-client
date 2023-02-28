module.exports = {
  protocal: 1,
  socket: {
    setting: "prod",
    test: {
      host: 'http://127.0.0.1/',
      path: '/__pies.cf/websocket/public/tunnel/'
    },
    prod: {
      host: 'https://pies.cf/',
      path: '/__pies.cf/websocket/public/tunnel/'
    }
  }
}