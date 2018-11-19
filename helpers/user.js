const db = require("../firebase")

module.exports = {
    resgisterValidation: function (req, res, next) {

        let errors = {}
        let passed = false


        let name = req.body.name.trim()
        let username = req.body.username.trim()
        let password = req.body.password.trim()

        let isEmpty = (obj) => {
            return !obj || Object.keys(obj).length === 0;
        }


        if (name.length == 0) {
            errors.name = "Wajib di isi"
        } else if (name.length < 3) {
            errors.name = "Minimal 3 karakter"
        } else if (name.length > 20) {
            errors.name = "Maximal 20 karakter"
        }

        if (username.length == 0) {
            errors.username = "Wajib di isi"
        } else if (username.length < 6) {
            errors.username = "Minimal 6 karakter"
        } else if (username.length > 255) {
            errors.username = "Maximal 255 karakter"
        } else if (!username.match(/^[A-Za-z_]{1}[A-Za-z0-9_]{1,}$/)) {
            errors.username = "Format tidak cocok"
        }

        if (password.length == 0) {
            errors.password = "Wajib di isi"
        } else if (password.length < 3) {
            errors.password = "Minimal 3 karakter"
        }

        if (isEmpty(errors)) {

            let pass = (snapshot) => {
                for (let i in snapshot.val()) {
                    if (snapshot.val()[i].username == username) {
                        errors.username = "Tidak tersedia"
                        break
                    }
                }

                if (isEmpty(errors)) {
                    req.username = username
                    req.name = name
                    req.password = password
                    next()
                } else {
                    res.send({
                        passed,
                        errors
                    })
                }
            }

            let err = (err) => {
                errors.username = err
                res.send({
                    passed,
                    errors
                })
                return 0;
            }

            db.ref("users").once("value", pass, err)

        } else {
            res.send({
                passed,
                errors
            })
            return 0;
        }
    },

    loginValidation: function (req, res, next) {
        let errors = {}
        let passed = false

        let isEmpty = (obj) => {
            return !obj || Object.keys(obj).length === 0;
        }

        let username = req.body.username.trim()
        let password = req.body.password.trim()

        if (username.length == 0) {
            errors.username = "Wajib di isi"
        } else if (username.length < 6) {
            errors.username = "Minimal 6 karakter"
        } else if (username.length > 255) {
            errors.username = "Maximal 255 karakter"
        } else if (!username.match(/^[A-Za-z_]{1}[A-Za-z0-9_]{1,}$/)) {
            errors.username = "Format tidak cocok"
        }

        if (password.length == 0) {
            errors.password = "Wajib di isi"
        } else if (password.length < 3) {
            errors.password = "Minimal 3 karakter"
        }

        if (isEmpty(errors)) {

            req.username = username
            req.password = password
            next()

        } else {
            res.send({
                passed,
                errors
            })
            return 0;
        }
    },

    avatarValidation: (req, res, next) => {
        let passed = false;
        let errors = ""
        if (Object.keys(req.files).length == 0) {
            errors = "Tidak ada gambar yang di pilih"
            return res.send({
                passed,
                errors
            })
        } else if (Object.keys(req.files).length > 1) {
            errors = "Gambar lebih dari satu"
            return res.send({
                passed,
                errors
            })
        } else {
            next()
        }
    },

    nameValidation: (req, res, next) => {
        let name = req.body.name.trim()
        let errors = null
        if (name.length == 0) {
            errors = "Wajib di isi"
        } else if (name.length < 3) {
            errors = "Minimal 3 karakter"
        } else if (name.length > 20) {
            errors = "Maximal 20 karakter"
        }

        if(!errors){
            next()
        }else{
            res.send({
                passed: false,
                errors: errors
            })
        }
    }
}