const express = require('express')
const router = express.Router()
const User = require('../schemas/UserSchema')

router.get('/:id', (req, res, next) => {
    let payload = {
        pageTitle: 'View Post',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id,
    }

    res.status(200).render('postPage', payload)
})

module.exports = router
