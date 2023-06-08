const {User} = require("../db");

const createUser = async (req, res) => {
  try {
    const {username, name, lastname, email, image_profile_url, birthdate} =
      req.body;

    const [user, created] = await User.findOrCreate({
      where: {email: email},
      defaults: {
        username,
        name,
        lastname,
        email,
        image_profile_url,

        birthdate,
      },
    });

    if (
      !username ||
      !name ||
      !lastname ||
      !email ||
      !image_profile_url ||
      !birthdate
    ) {
      res.status(500).send("Verifique si falta la información de algún campo");
    } else {
      !created
        ? res
            .status(409)
            .send(
              "El correo electrónico ya está asociado a una cuenta, intente iniciar sesión"
            )
        : res.status(201).send("El usuario fué creado correctamente");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
};
