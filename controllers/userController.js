// controllers/userController.js
// Placeholder for user related business logic

exports.getUsers = (req, res) => {
  res.send('Get users controller');
};

exports.getUserById = (req, res) => {
  res.send(`Get user by ID controller: ${req.params.id}`);
};
