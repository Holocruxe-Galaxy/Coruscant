const {User} = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllUsers,
};
