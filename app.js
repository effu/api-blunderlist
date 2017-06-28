const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const mongoose   = require('mongoose')
const passport   = require('passport')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session    = require('express-session')

const items      = require('./routes/items')
const groups     = require('./routes/groups')
const users      = require('./routes/users')
const auth       = require('./routes/auth')

const passportSetup = require('./config/passport')

passportSetup(passport)


// connect to your local DB
// mongod
mongoose.connect('mongodb://localhost/drumpf')
// Connect to Kaden's DB
// mongoose.connect('mongodb://144.38.175.196/YourName')
// connect to DJ's DB
// mongoose.connect('mongodb://mongodb.cs.dixie.edu/YourName')


app.engine('.hbs', handlebars({ defaultLayout: 'single', extname: '.hbs' }))
app.set('view engine', '.hbs')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function (req, res) {
  res.render('hello', {
    name: 'Kaden',
    list: ['NodeJS', 'ReactJS', 'Mongo', 'Mongoose']
  })
})

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(session({ secret: 'mysupersecretsessionkeyisdrumpf' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(auth)
app.use(users)
// app.all('*', passport.authenticate('basic', { session: false }))
app.use(items)
app.use(groups)


app.listen(3001, function () {
  console.log('Drumpf API listening on port 3001!')
})
