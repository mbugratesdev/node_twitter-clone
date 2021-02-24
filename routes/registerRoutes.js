const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../schemas/UserSchema')

router.get('/', (req, res, next) => {
    res.status(200).render('register')
})
router.post('/', async (req, res, next) => {
    var firstName = req.body.firstName.trim()
    var lastName = req.body.lastName.trim()
    var username = req.body.username.trim()
    var email = req.body.email.trim()
    var password = req.body.password

    var payload = req.body

    if (firstName && lastName && username && email && password) {
        let user = await User.findOne({
            $or: [{ username }, { email }],
        }).catch((err) => {
            console.log(err)
            payload.errorMessage = 'Something went wrong'
            res.status(200).render('register', payload)
        })

        if (!user) {
            // No user found
            var data = req.body
            data.password = await bcrypt.hash(password, 10)
            User.create(data).then((user) => {
                req.session.user = user
                res.redirect('/')
            })
        } else {
            // User found
            if (email == user.email) {
                payload.errorMessage = 'Email already in use'
            } else {
                payload.errorMessage = 'Username already in use'
            }
            res.status(200).render('register', payload)
        }
    } else {
        payload.errorMessage = 'Make sure each field has a valid value'
        res.status(200).render('register', payload)
    }
})

module.exports = router
