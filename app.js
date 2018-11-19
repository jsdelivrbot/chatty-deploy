const db = require("./firebase")

module.exports = (app, io) => {

    require("./controllers/user")(app)
    

    app.use((req, res, next) => {

        if (req.cookies.session_token && req.cookies.uid) {

            let session_token = req.cookies.session_token
            let uid = req.cookies.uid

            function pass(snapshot) {

                let data_user = null
                if(snapshot.exists()){
                    if (snapshot.val().session_token) {
                        if (snapshot.val().session_token === session_token) {
                            data_user = {
                                id: uid,
                                data: snapshot.val()
                            }
                        }
                    }
                }

                if (data_user) {
                    res.render("index", {
                        userId: data_user.id,
                        user: data_user.data,
                        isLogin: true
                    })
                } else {
                    res.render("auth", {
                        layout: "auth",
                        isLogin: false
                    })
                }
            }

            function err(err) {
                console.log(err)
            }

            db.ref(`users/${uid}`).once("value", pass, err)

        } else {
            res.render("auth", {
                layout: "auth",
                isLogin: false
            })
        }
        return 0;
    })

    require("./models/socket")(io)
}