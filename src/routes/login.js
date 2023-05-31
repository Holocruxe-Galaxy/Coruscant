const express = require("express");
const {loginUser} = require("../controllers/login");
const router = express();

router.post("/", loginUser);

module.exports = router;
