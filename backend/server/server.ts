import express from "express";
const routers = require("../controllers");
const cors = require("cors");
const server = express();

server.use(cors());

// Roteamento da aplicação
server.use(express.json());
server.use("/", routers);

export { server };
