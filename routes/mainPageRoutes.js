const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    let payload = {
        pageTitle: 'Home',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render('home', payload)
})

module.exports = router
