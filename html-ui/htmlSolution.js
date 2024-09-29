const express = require('express')
const getPort = require('get-port')

module.exports = async function () {
  const app = express()
  const port = await getPort()

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/tddchatbot.html')
  })

  let server

  return new Promise(function (resolve, reject) {
    const url = `http://localhost:${port}`

    server = app.listen(port, () => {
      resolve(Object.freeze({
        url,
        close,
      }))
    })
  })

  async function close () {
    return new Promise(function (resolve, reject) {
      server.close(function (err) {
        if (err) reject(err)
        resolve()
      })
    })
  }
}