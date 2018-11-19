const db = require("../firebase")
const bcrypt = require('bcrypt')
const hash = require("../helpers/hash")
const sharp = require("sharp")
const fs = require('fs')

var User = {
    create: (req, res) => {
        bcrypt.hash(req.password, 10, (err, hash) => {
            let fields = {
                name: req.name,
                username: req.username,
                password: hash,
                online: false
            }
            if (db.ref("users").push(fields)) {
                res.send({
                    passed: true
                })
            } else {
                res.send({
                    passed: false
                })
            }
        })
    },

    login: (req, res) => {
        let username = req.username
        let password = req.password

        db.ref("users").once("value", snapshot => {

            let data = null;

            for (let id in snapshot.val()) {
                if (snapshot.val()[id].username === username) {
                    data = {
                        id: id,
                        data: snapshot.val()[id]
                    }
                }
            }

            if (data) {
                if (bcrypt.compareSync(password, data.data.password)) {

                    let session_token = hash.unique(202)

                    db.ref(`users/${data.id}`).update({
                        session_token
                    })

                    res.cookie("session_token", session_token, {
                        expires: new Date(Date.now() + 900000)
                    })

                    res.cookie("uid", data.id, {
                        expires: new Date(Date.now() + 900000)
                    })

                    return res.send({
                        passed: true
                    })

                }
            }

            return res.send({
                passed: false,
                errors: {
                    username: "Kombinasi tidak cocok"
                }
            })

        }, err => {
            console.log(err)
        })
    },

    update: {
        name: (req, res) => {
            let passed = false
            let errors = ""

            let session_token = req.cookies.session_token
            let uid = req.cookies.uid

            let ref = db.ref(`users/${uid}`)

            function pass(snapshot){
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

                if(data_user){

                    ref.update({
                        "name": req.body.name.trim()
                    })

                    passed = true

                    res.send({
                        passed,
                        errors
                    })

                }else{
                    errors = "453251151322132"
                    res.send({
                        passed,
                        errors
                    })
                }
            }

            function err(err){
                console.log(err)
            }

            ref.once("value", pass, err)
        },
        avatar: (req, res) => {
            let passed = false
            let errors = ""

            let session_token = req.cookies.session_token
            let uid = req.cookies.uid

            let ref = db.ref(`users/${uid}`)

            let option = {
                width: 500,
                height: 500,
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            }

            function err(err){
                res.send({
                    passed: false,
                    errors: err
                })
            }

            function pass(snapshot){
                
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

                if(data_user){
                    
                    let file = req.files.file
                    let name = `${data_user.data.username}_${hash.unique(20)}.jpg`
                    let dest = `./public/uploads/${name}`

                    sharp(file.data).resize(option).toFile(dest, (err) => {
                        if (err) {
                            
                            return res.send({
                                passed: false,
                                errors: "Format file tidak di dukung!"
                            })
                        }
                        
                        ref.update({
                            "avatar": name
                        })

                        let oldFile = `${__dirname}/../public/uploads/${data_user.data.avatar}`
                        
                        fs.exists(oldFile,function(exists){
                            if(exists){
                                fs.unlinkSync(oldFile);
                            }
                        })

                        passed = true
                        res.send({
                            passed,
                            errors
                        })
                    })
                }else{
                    err(null)
                }
            }

            

            ref.once("value", pass, err)
        }
    }
}

module.exports = User