 import User from '../components/users/userModel.js';
 import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';

const authLocal = passport.use(
    new localStrategy({ usernameField: 'email' },
        (email, password, done) => {
            User.findOne({ email: email }, (err, user) => {
                if (err)
                    return done(err);
                // unknown user
                else if (!user)
                    return done(null, false, { message: 'Email is not registered' });
                // wrong password
                else if (!user.verifyPassword(password))
                    return done(null, false, { message: 'Invalid Email or Password.' });
                // authentication succeeded
                else
                    return done(null, user);
            });
        })
);
export default authLocal