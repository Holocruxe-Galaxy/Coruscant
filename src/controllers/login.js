const {User} = require("../db");

const loginUser = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({where: {email: email}});
    user
      ? res.status(200).send(user)
      : res
          .status(201)
          .send(
            "El correo con el que está queriendo iniciar sesión no existe, por favor registrese"
          );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginUser,
};
