require("dotenv").config();
const port = 8080;

var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuthStrategy;
var cors = require("cors");
var app = express();

// Create a new Express application.

app.use(cors());
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

passport.use(
  new GoogleStrategy(
    {
      consumerKey: process.env.GOOGLE_CONSUMER_KEY,
      consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback"
    },
    function(token, tokenSecret, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }
  )
);

// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// middlewares which i don't fully understand lol but they are good to have

app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT || port, () => {
  console.log("Server listening on port", port);
});
