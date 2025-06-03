// config/passport.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/user.model.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      
      callbackURL: `${process.env.VITE_API_URL}/api/user/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await UserModel.findOne({ email });

        if (!user) {
          user = await UserModel.create({
        name: profile.displayName,
        email,
        isOAuthUser: true,  // <-- mark user as OAuth user
        verify_email: true,
        status: 'Active',
        avatar: profile.photos[0]?.value,
        // no password field needed here
        });

        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
