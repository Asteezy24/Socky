require('dotenv').config()
const log = require('ololog').configure({ locate: false })
const express = require('express')
const path = require('path')
const apiRouter = require('./routes/api')
const apiResponse = require('./helpers/apiResponse')
const mongoose = require('mongoose')
const logger = require('morgan')
const bodyParser = require('body-parser')

// DB connection
const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL, { useNewUrlParser: true }).then(() => {
  // don't show the log when it is test
  if (process.env.NODE_ENV !== 'test') {
    console.log('Connected to %s', MONGODB_URL)
    console.log('App is running ... \n')
  }
})
  .catch(err => {
    console.error('App starting error:', err.message)
    process.exit(1)
  })
const db = mongoose.connection
mongoose.Promise = global.Promise

const app = express()

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'))
}
// body parser
app.use(bodyParser.json())
app.use('/api/', apiRouter)

// error handlers
// throw 404 if URL not found
app.all('*', function (req, res) {
  return apiResponse.notFoundResponse(res, 'Endpoint not found')
})

app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    return apiResponse.unauthorizedResponse(res, err.message)
  }
})

app.use(express.static(path.join(__dirname, 'public')))
module.exports = app

//
// const server = http.createServer(function (request, response) {
// 	console.log((new Date()) + " Received request for " + request.url)
// 	response.writeHead(404)
// 	response.end()
// })
//
//

//
// const wsServer = new WebSocketServer({
// 	httpServer: server,
// 	protocols: ["echo-protocol"],
// 	// You should not use autoAcceptConnections for production
// 	// applications, as it defeats all standard cross-origin protection
// 	// facilities built into the protocol and the browser.  You should
// 	// *always* verify the connection's origin and decide whether or not
// 	// to accept it.
// 	autoAcceptConnections: false
// })
//
// // start REST server
// app.listen(process.env.PORT, () => {
// 	const dt = utils.dateTimeString()
// 	log(dt.blue, "Server is live on port 3000".green)
// 	TickerController.collectData()
// 	createDummyUser()
// })
//
// function sendSocketMessage (sentiment, underlying) {
// 	let message = {
// 		action: "huh",
// 		underlying: "foo"
// 	}
//
// 	wsServer.connections.forEach(function each (client) {
// 		console.log("sending socket message to " + client.remoteAddress)
// 		client.send(JSON.stringify(message))
// 	})
// }
//
// wsServer.on("request", function (request) {
// 	socketHandler.handleConnection(request)
// })
//
// function createDummyUser () {
// 	User.findOne({ username: "alex" }, (err, user) => {
// 		if (err) return
// 		if (user === null) {
// 			const user = new User({
// 				username: "alex",
// 				deviceToken: "0",
// 				strategies: []
// 			})
// 			user.save((err) => {
// 				if (err) {
// 					if (err.name === "MongoError" && err.code === 11000) {
// 						console.log("User already registered")
// 					}
// 					console.log(err.message)
// 					return
// 				}
// 				console.log("New user created!")
// 			})
// 		} else {
// 			console.log("user exists already")
// 		}
// 	})
// }
//
