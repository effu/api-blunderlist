const BasicStrategy  = require('passport-http').BasicStrategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const User           = require('./models/user')
const configAuth     = require('./auth')


module.exports = function (passport) {
    passport.use(new BasicStrategy(function (username, password, callback) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { 
            return callback(err)
            }
            if (!user) { 
            return callback(null, false)
            }
            if (user.password != password) { 
            return callback(null, false)
            }
            return callback(null, user)
        })
    }))

    passport.use(new GoogleStrategy({
        clientID:       configAuth.googleAuth.clientID,
        clientSecret:   configAuth.googleAuth.clientSecret,
        callbackURL:    configAuth.googleAuth.callbackURL
    }, 
    function (token, refreshToken, profile, done) {
        User.findOne({ 'google.id': profile.id }, function (err, user) {
            if (err) { return done(err) }
            if (user) {
                return done(null, user)
            } else {
                // TODO: Finish
                const newUser = new User()

                newUser.google.id = profile.id
                newUser.google.token = token
                newUser.google.name = profile.displayName
                newUser.google.email = profile.emails[0].value

                newUser.save(function (err) {
                    if (err) { throw err }
                    return done(null, newUser)
                })
            }

        })
    }))
}
