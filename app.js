const express = require('express')
const app = express()

const PORT = process.env.PORT || 3003
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

app.set('view engine', 'pug')
app.set('views', 'views')

app.get('/', (req, res, next) => {
    let payload = {
        pageTitle: 'Home',
    }

    res.status(200).render('home', payload)
})
