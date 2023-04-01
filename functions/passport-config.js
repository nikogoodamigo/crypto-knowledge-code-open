const LocalStrategy = require ("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByUsername){
    const authenticateUser = async (username, password, done) =>{
        const user = getUserByUsername(username);
        if (user == null){
            return done(null, false, {message: 'The given username does not exist'});
        }

        try{
            if (await bcrypt.compare(password, user.password)){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Password incorrect'});
            }
        } catch (err) {
            return done(err);
        }

    };

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => {});
    passport.deserializeUser((id, done) => {});
};

module.exports = {initialize};