import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Driver } from "../models/driver.model";
import getLatLng from "../utils/getLongitudeAndLatitude";

//Interface
import { DriverAttributes } from "../models/driver.model";

//Google Maps
import { Client } from "@googlemaps/google-maps-services-js";
import { Op } from "sequelize";
import { Assessment } from "../models/assessment.model";

//Roteamento
const express = require("express");
const router = express.Router();

dotenv.config();
const client = new Client({});

interface RequestBody {
  id: string;
  origin: string;
  destination: string;
}

interface ResponseBody {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: Array<DriverAttributes>;
}

router.get("/estimate", async (req: Request, res: Response) => {
  try {
    const { id, origin, destination }: RequestBody = req.body;
    let originCoordinates = { latitude: 0, longitude: 0 };
    let destinationCoordinates = { latitude: 0, longitude: 0 };

    if (!origin || !destination) {
      res.status(400).json({ error: "Origin and destination are required." });
    }

    try {
      originCoordinates = await getLatLng(origin, client);
      destinationCoordinates = await getLatLng(destination, client);
    } catch (error) {
      res.status(400).json({
        error_code: "INVALID ADRESS",
        error_description: error instanceof Error ? error.message : "",
      });
    }

    const response = await client.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        key: process.env.GOOGLE_API_KEY!,
      },
    });

    const result = response.data.rows[0].elements[0];

    if (result.status !== "OK") {
      res
        .status(400)
        .json({ error: "Unable to calculate distance and duration." });
    }

    const distance = result.distance.text;
    const distanceNumber: number = parseFloat(distance.replace(/[^\d.]/g, ""));
    const duration = result.duration.text;

    //Consultando os motoristas que atendem ao requisito de Kilometragem minima
    const driversWithMinKm = await Driver.findAll({
      where: {
        minKm: {
          [Op.lt]: distanceNumber,
        },
      },
    });

    const driversAndValues = await Promise.all(
      driversWithMinKm.map(async (driver) => {
        let driverValues = driver.dataValues;
        const review = await Assessment.findAll({
          where: {
            driverId: driverValues.id,
          },
        });
        driverValues.value = distanceNumber * driverValues.ratePerKm;
        driverValues.review = {
          rating: review[0].dataValues.rating,
          comment: review[0].dataValues.comment,
        };
        return driverValues;
      })
    );

    const objectResponse: ResponseBody = {
      origin: {
        latitude: originCoordinates.latitude,
        longitude: originCoordinates.longitude,
      },
      destination: {
        latitude: destinationCoordinates.latitude,
        longitude: destinationCoordinates.longitude,
      },
      distance: distanceNumber,
      duration: duration,
      options: driversAndValues,
    };
    res.json(objectResponse);
  } catch (e) {
    res.status(500).json({});
  }
});

module.exports = router;