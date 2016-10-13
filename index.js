var express         = require("express");
var morgan          = require("morgan");
var methodOverride  = require("method-override");
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var passport        = require("passport");
var expressJWT      = require("express-jwt");
var qs              = require('qs');
var config          = require("./config/config");
var app             = express();


mongoose.connect(config.database);

require("./config/passport")(passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === "object" && "_method" in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(passport.initialize());

app.use('/api', expressJWT({ secret: config.secret })
.unless({
  path: [
    { url: '/api/login', methods: ['POST'] },
    { url: '/api/register', methods: ['POST'] }
  ]
}));


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Unauthorized request.'});
  }
  next();
});

//****** Routing *******//
var routes = require("./config/routes");
app.use("/api", routes);

// //******** Front End ********* //
// app.use("/", express.static(__dirname + "/public"));
// app.use("/", express.static(__dirname + "/bower_components"));
//
// app.get("/*", function(req, res){
//  res.sendFile(__dirname + "/public/index.html");
// });

app.listen(config.port, function(){
  console.log("hello barrierbreaker listening on port " + config.port);
});
