require("dotenv").config();
const port = 8080;

var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuthStrategy;
var cors = require("cors");

// Create a new Express application.
var app = express();

app.use(cors());

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
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

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get("/login/facebook", passport.authenticate("facebook"));

app.get(
  "/return",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

app.listen(process.env.PORT || port, () => {
  console.log("Server listening on port", port);
});
