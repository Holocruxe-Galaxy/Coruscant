const express = require("express");
const {createUser} = require("../controllers/Register");

const router = express();

router.post("/", createUser);

module.exports = router;
