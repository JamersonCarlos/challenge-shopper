//Roteamento
const express = require("express");
const router = express.Router();

//Models
import { Trip } from "../models/trip.model";

import { Request, Response } from "express";

router.get("", async (req: Request, res: Response) => {
  try {
    const listTrips: Trip[] = await Trip.findAll(); 
    const response = {
        customer_id: '', 
        rides: listTrips.map((trip) => {
          const { id_driver, driver_name, ...rest } = trip.toJSON();
          return {
            ...rest,
            driver: {
              id: id_driver,
              name: driver_name,
            },
          };
        }),
      };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error_code: "INTERNAL_SERVER_ERROR" });
  }
});

module.exports = router;
