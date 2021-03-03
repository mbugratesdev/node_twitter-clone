const express = require('express')
const dotenv = require('dotenv')
const middleware = require('./middleware/middleware')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Connect to database
require('./config/database')

const app = express()

app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'bbq chips', resave: true, saveUninitialized: true }))

// Routes
app.use('/login', require('./routes/loginRoutes'))
app.use('/register', require('./routes/registerRoutes'))
app.use('/logout', require('./routes/logout'))
app.use('/profile', middleware.requireLogin, require('./routes/profileRoutes'))
app.use('/posts', middleware.requireLogin, require('./routes/postRoutes'))
app.use('/uploads', require('./routes/uploadRoutes'))
app.use('/search', middleware.requireLogin, require('./routes/searchRoutes'))
app.use('/messages', middleware.requireLogin, require('./routes/messagesRoutes'))
app.use('/notifications', middleware.requireLogin, require('./routes/notificationRoutes'))
app.use('/', middleware.requireLogin, require('./routes/mainPageRoutes'))

// API routes
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/chats', require('./routes/api/chats'))
app.use('/api/messages', require('./routes/api/messages'))
app.use('/api/notifications', require('./routes/api/notifications'))

const PORT = process.env.PORT || 3003
const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

const io = require('socket.io')(server, { pingTimeout: 60000 })

io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join room', (room) => socket.join(room))

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))
    socket.on('notification received', (room) => socket.in(room).emit('notification received'))

    socket.on('new message', (newMessage) => {
        var chat = newMessage.chat
        if (!chat.users) return console.log('chat.users not defined')
        chat.users.forEach((user) => {
            if (user._id == newMessage.sender._id) return
            socket.in(user._id).emit('message received', newMessage)
        })
    })
})
