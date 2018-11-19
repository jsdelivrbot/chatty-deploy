const helperUser = require("../helpers/user")
const modelUser = require("../models/user")

function csrf(req, res, next){
    
    next()
}

module.exports = (app) => {
    app.post( "/api/register", helperUser.resgisterValidation, modelUser.create)
    app.post("/api/login", helperUser.loginValidation, modelUser.login)

    app.post("/api/profile/avatar", csrf, helperUser.avatarValidation, modelUser.update.avatar)
    app.post("/api/profile/name", csrf, helperUser.nameValidation, modelUser.update.name)
}