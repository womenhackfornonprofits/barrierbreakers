var LocalStrategy = require("passport-local").Strategy;
var User          = require("../models/user");

module.exports = function(passport){
  // Can use the passport variable here now becuase it was passed into app.js

  passport.use("local-signup", new LocalStrategy({
    usernameField: "email",     // Overwriting the default of 'username' as unique identifier
    passwordField: "password",
    passReqToCallback: true,   // Passing the value of req.body to the next function
    session: false,
  }, function(req, email, password, done){
    // We're going to register a user in here...

    // Find whether a user has already been registered with this email
    User.findOne({ "email": email }, function(err, user) {
      // The arguements for done are 1. Error, 2. A User Object, 3. Info Message
      if (err) return done(err, false, { message: "Something went wrong "});
      if (user) return done(null, false, { message: "Please choose another email "});

      // If we get to here, there isn't a user with that email, so we'll create one!
      var newUser = new User({
        username:             req.body.username,
        firstName:            req.body.firstName,
        lastName:             req.body.lastName,
        email:                req.body.email,
        password:             req.body.password,
        passwordConfirmation: req.body.passwordConfirmation
      });

      // Save the user. This is where bcrypt will hash the password with the .set function defined in the model.
      newUser.save(function(err, user) {
        if (err) return done(err, false, { message: "Something went wrong" });
        return done(null, user);
      });
    });
  }));

};
