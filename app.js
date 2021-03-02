const express = require('express')
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require('body-parser')
const Database = require('./database')
const session = require('express-session')

const app = express()

app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
    session({
        secret: 'bbq chips',
        resave: true,
        saveUninitialized: true,
    })
)

// Routes
app.use('/login', require('./routes/loginRoutes'))
app.use('/register', require('./routes/registerRoutes'))
app.use('/logout', require('./routes/logout'))
app.use('/profile', middleware.requireLogin, require('./routes/profileRoutes'))
app.use('/posts', middleware.requireLogin, require('./routes/postRoutes'))
app.use('/uploads', require('./routes/uploadRoutes'))
app.use('/search', middleware.requireLogin, require('./routes/searchRoutes'))
app.use(
    '/messages',
    middleware.requireLogin,
    require('./routes/messagesRoutes')
)

// API routes
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/chats', require('./routes/api/chats'))

app.get('/', middleware.requireLogin, (req, res, next) => {
    let payload = {
        pageTitle: 'Home',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render('home', payload)
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
