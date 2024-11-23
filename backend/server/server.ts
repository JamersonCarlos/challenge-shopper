import express from "express";
const routers = require("../controllers");

const server = express();

// Roteamento da aplicação
server.use(express.json());
server.use("/", routers);

export { server };
