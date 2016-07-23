var User  = require("../models/user");

function usersIndex(req, res) {
  User.find(function(err, users){
    if (err) return res.status(404).json({ message: 'Something went wrong.' });
    res.status(200).json(users);
  });
}

function usersShow(req, res) {
  User.findById(req.params.id).populate("hobbies").exec(function(err, user){
    if (err) return res.status(404).json({ message: 'Something went wrong.' });
    res.status(200).json(user);
  });
}




module.exports = {
  index       : usersIndex,
  show        : usersShow
};
