const express = require('express')
const router = express.Router()
const Post = require('../../schemas/PostSchema')
const User = require('../../schemas/UserSchema')

router.get('/', (req, res, next) => {
    Post.find()
        .populate('postedBy')
        .sort({ createdAt: -1 })
        .then((results) => res.status(200).send(results))
        .catch((error) => {
            console.error(error)
            res.sendStatus(400)
        })
})

router.post('/', async (req, res, next) => {
    if (!req.body.content) {
        console.log('Content param not sent with request')
        return res.sendStatus(400)
    }

    var postData = {
        content: req.body.content,
        postedBy: req.session.user,
    }

    Post.create(postData)
        .then(async (newPost) => {
            newPost = await User.populate(newPost, { path: 'postedBy' })
            res.status(201).send(newPost)
        })
        .catch((error) => {
            console.log(error)
            res.sendStatus(400)
        })
})

router.put('/:id/like', async (req, res, next) => {
    const postId = req.params.id
    const userId = req.session.user._id

    // Check if user has already like the post
    var isLiked =
        req.session.user.likes && req.session.user.likes.includes(postId)

    var option = isLiked ? '$pull' : '$addToSet'

    // Insert user like
    req.session.user = await User.findByIdAndUpdate(
        userId,
        { [option]: { likes: postId } },
        { new: true }
    ).catch((error) => {
        console.log(error)
        res.sendStatus(400)
    })

    // Inser post like
    const post = await Post.findByIdAndUpdate(
        postId,
        { [option]: { likes: userId } },
        { new: true }
    ).catch((error) => {
        console.log(error)
        res.sendStatus(400)
    })

    res.status(200).send(post)
})

module.exports = router
