const admin = require("firebase-admin")
const config = require('./config')

admin.initializeApp({
    credential: admin.credential.cert(require(config.firebase.serviceAccount)),
    databaseURL: config.firebase.databaseURL
})

module.exports = admin.database()