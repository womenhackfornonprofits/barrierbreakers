var passport = require("passport");
var User = require("../models/user");
var secret = require("../config/config").secret;
var config = require("../config/config");
var jwt = require("jsonwebtoken");
var rp  = require('request-promise');


function register(req, res, next) {
    var localStrategy = passport.authenticate('local-signup', function(err, user, info) {
        console.log(err);
        if (err) return res.status(500).json(info);
        if (info) return res.status(401).json(info);
        if (!user) return res.status(401).json(info);

        // Choose what data to use as the information to store inside the JWT that will identify this user
        var payload = user;
        // Create a token to send back to the user
        var token = jwt.sign(payload, secret, {
            expiresIn: 60 * 60 * 24
        });

        // Send back the token to the front-end to store
        return res.status(200).json({
            success: true,
            message: "Thank you for authenticating",
            user: user,
            token: token
        });
    });

    return localStrategy(req, res, next);
}


function login(req, res, next) {
    User.findOne({
        "email": req.body.email
    }, function(err, user) {
        if (err) return res.status(500).json({
            message: "Something went wrong"
        });
        if (!user) return res.status(403).json({
            message: 'No user found.'
        });
        if (!user.validatePassword(req.body.password)) return res.status(403).json({
            message: 'Authentication failed.'
        });

        // Choose what data to use as the information to store inside the JWT that will identify this user
        var payload = user;
        // Create a token to send back to the user
        var token = jwt.sign(payload, secret, {
            expiresIn: 60 * 60 * 24
        });

        return res.status(200).json({
            success: true,
            message: 'Welcome!',
            user: user,
            token: token
        });
    });
}

module.exports = {
    login: login,
    register: register,
};
