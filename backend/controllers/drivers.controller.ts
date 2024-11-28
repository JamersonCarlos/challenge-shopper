import { Request, Response, NextFunction } from "express";

//Roteamento
const express = require("express");
const router = express.Router();

//Models
import { Driver } from "../models/driver.model";

router.get("", async (req: Request, res: Response) => {
  try {
    const response: Array<Driver> = await Driver.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
