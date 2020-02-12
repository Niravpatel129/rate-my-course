require("dotenv").config();
const port = 8080;

var express = require("express");
var passport = require("passport");
var Strategy = require("passport-facebook").Strategy;

passport.use(
  new Strategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/return"
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
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

// Create a new Express application.
var app = express();

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
