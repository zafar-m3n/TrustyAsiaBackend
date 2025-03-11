const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/UserModel");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      callbackURL: `${process.env.NODE_TRUSTYASIA_BASEURL}/api/v1/auth/google/redirect`,
      clientID: process.env.NODE_TRUSTYASIA_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NODE_TRUSTYASIA_GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { google_id: profile.id } });

        if (user) {
          console.log("User already exists", user.email);
          return done(null, user);
        }

        user = await User.create({
          google_id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profile_image: profile.photos[0].value,
          role: "user",
        });

        console.log("New user created", user.email);
        // return done(null, user);
      } catch (err) {
        console.log("Cannot retrieve profile", err);
        // return done(err, null);
      }
    }
  )
);

// Serialize user (for session handling)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// // Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
