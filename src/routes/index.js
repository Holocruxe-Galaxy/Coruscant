const express = require("express");
const router = express();
const register = require("./register");
const users = require("./users");
const login = require("./login");

router.use("/register", register);
router.use("/login", login);
router.use("/users", users);

module.exports = router;
