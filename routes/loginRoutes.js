const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../schemas/UserSchema')

router.get('/', (req, res, next) => {
    res.status(200).render('login')
})
router.post('/', async (req, res, next) => {
    let payload = req.body

    if (req.body.logUsername && req.body.logPassword) {
        let user = await User.findOne({
            $or: [
                { username: req.body.logUsername },
                { email: req.body.logUsername },
            ],
        }).catch((err) => {
            console.log(err)
            payload.errorMessage = 'Something went wrong'
            res.status(200).render('login', payload)
        })

        if (user) {
            const result = await bcrypt.compare(
                req.body.logPassword,
                user.password
            )

            if (result === true) {
                req.session.user = user
                return res.redirect('/')
            }
        }
        payload.errorMessage = 'Login credentials incorrect'
        return res.status(200).render('login', payload)
    }
    payload.errorMessage = 'Make sure each fields has a valid value'
    res.status(200).render('login')
})

module.exports = router
