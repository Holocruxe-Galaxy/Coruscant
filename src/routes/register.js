const express = require("express");
const {createUser} = require("../controllers/register");

const router = express();

router.post("/", createUser);

module.exports = router;
