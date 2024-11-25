import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import getLatLng from "../utils/getLongitudeAndLatitude";

//Models
import { Driver } from "../models/driver.model";
import { Trip } from "../models/trip.model";

//Interface
import { DriverAttributes } from "../models/driver.model";

//Google Maps
import { Client } from "@googlemaps/google-maps-services-js";
import { Op, where } from "sequelize";
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

interface RequestBodyConfirm {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
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

function isRequestBodyConfirm(data: any): data is RequestBodyConfirm {
  return (
    typeof data === "object" &&
    typeof data.origin === "string" &&
    typeof data.destination === "string" &&
    typeof data.customer_id === "string" &&
    typeof data.value === "number" &&
    typeof data.distance === "number" &&
    typeof data.duration === "string" &&
    typeof data.driver === "object" &&
    typeof data.driver.id === "number" &&
    typeof data.driver.name === "string"
  );
}

//"POST /ride/estimate"
router.post("/estimate", async (req: Request, res: Response) => {
  try {
    const { id, origin, destination }: RequestBody = req.body;
    let originCoordinates = { latitude: 0, longitude: 0 };
    let destinationCoordinates = { latitude: 0, longitude: 0 };

    if (!origin || !destination) {
      return res
        .status(400)
        .json({ error: "Origin and destination are required." });
    }

    try {
      originCoordinates = await getLatLng(origin, client);
    } catch (error) {
      return res.status(400).json({
        error_code: "INVALID ADRESS",
        error_description: "Endereço de origem inválido",
      });
    }

    try {
      destinationCoordinates = await getLatLng(destination, client);
    } catch (error) {
      return res.status(400).json({
        error_code: "INVALID ADRESS",
        error_description: "Endereço de destino inválido",
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
      return res
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

//"PATCH /ride/confirm"
router.patch("/confirm", async (req: Request, res: Response) => {
  try {
    const result = req.body;
    //Validando dados de entrada
    if (!isRequestBodyConfirm(req.body)) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Os dados fornecidos não são válidos",
      });
    }
    const data: RequestBodyConfirm = req.body;

    //Validando se o motorista existe
    const drivers: Driver[] = await Driver.findAll({
      where: {
        id: data.driver.id,
      },
    });

    if (!drivers) {
      return res.status(400).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista não encontrado!",
      });
    }

    //Validando quilometragem
    const driverResult: DriverAttributes = drivers[0];
    if (data.distance < driverResult.minKm) {
      return res.status(400).json({
        error_code: "INVALID_DISTANCE",
        error_description:
          "Distância menor que a quilometragem minima do condutor",
      });
    }

    const trip = await Trip.create({
      customer_id: data.customer_id,
      destination: data.destination,
      origin: data.origin,
      distance: data.distance,
      id_driver: data.driver.id,
      driver_name: data.driver.name,
      value: data.value,
      duration: data.duration,
    });
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({});
  }
});

//GET /ride/{customer_id}?driver_id={id do motorista}
router.get("/:customer_id", async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;
    let whereCondition: any = { customer_id };

    if (driver_id) {
      whereCondition.id_driver = Number(driver_id);
      const result = await Driver.findOne({
        where: {
          id: Number(driver_id),
        },
      });
      if (!result) {
        return res.status(400).json({ error_code: "INVALID_DRIVER" });
      }
    }

    //Corrigir bug da documentação

    let listTrips = await Trip.findAll({
      where: whereCondition,
    });

    const response = {
      customer_id,
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
    console.log(error);
    res.status(500).json({ error_code: "INTERNAL_SERVICE_ERROR" });
  }
});

module.exports = router;
