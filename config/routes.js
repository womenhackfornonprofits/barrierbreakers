var express  = require('express');
var router   = express.Router();


//********* Controller *************//

var usersController             = require("../controllers/usersController");
var authenticationsController   = require("../controllers/authenticationsController");


//******* Routes ***********//

router.route('/login').post(authenticationsController.login);
router.route('/register').post(authenticationsController.register);
router.route('/users')
  .get(usersController.index);

  router.route('/users/:id')
    .get(usersController.show);


module.exports = router;
