const express = require("express");
const {getAllUsers} = require("../controllers/users");
const router = express();

router.get("/", getAllUsers);
module.exports = router;
