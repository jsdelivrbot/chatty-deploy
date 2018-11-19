const express = require('express')
const http = require('http')
const socket = require('socket.io')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const config = require('./config')



//Aplications setup
const app = express()
const webServe = http.Server(app)
const io = socket(webServe)

app.use('/public', express.static(config.staticDir))
app.engine('handlebars', exphbs({
    defaultLayout: 'app'
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(fileUpload())



require("./app")(app, io)



//Listen
webServe.listen(config.port, () => console.log(`DEMO http://localhost:${config.port}`))