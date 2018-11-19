const db = require("../firebase")
module.exports = (io) => {
    let uOnline = [];
    io.on('connection', function (socket) {

        socket.emit("_session_id", socket.id)
        socket.on('_session_on', (data) => {
            uOnline.push(data)
            let ref = db.ref("users/" + data.id)
            ref.once("value", (snapshot) => {
                if (snapshot.exists()) {
                    if (snapshot.val().session_token === data.token) {
                        ref.update({
                            online: true
                        })
                    }
                }
            })
        })

        socket.on('disconnect', function () {
            for (let k in uOnline) {
                if (uOnline[k]._session_id === socket.id) {
                    let ref = db.ref("users/" + uOnline[k].id)
                    console.lo
                    ref.once("value", (snapshot) => {
                        if (snapshot.exists()) {
                            if (snapshot.val().session_token === uOnline[k].token) {
                                ref.update({
                                    online: false
                                })
                                delete uOnline[k]
                            }
                        }
                    })
                }
            }
        })
    })
}