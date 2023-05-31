const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.js");

const server = express();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL

server.use(express.json());
server.use(cors(corsOptions));
server.use(routes);

module.exports = server;
