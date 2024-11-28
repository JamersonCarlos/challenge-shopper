import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import getLatLng from "../utils/getLongitudeAndLatitude";
import { cpf } from "cpf-cnpj-validator";

//Models
import { Driver } from "../models/driver.model";
import { Trip } from "../models/trip.model";

//Interface
import { DriverAttributes } from "../models/driver.model";
import { coordinatesInterface } from "../interfaces/coordinatesInterface";
import { ResponseBodyConfirm } from "../interfaces/responsesInterface";
import { ResponseBodyRideEstimate } from "../interfaces/responsesInterface";

//Google Maps
import {
  Client,
  DistanceMatrixResponse,
  DistanceMatrixRowElement,
} from "@googlemaps/google-maps-services-js";
import { Op, where } from "sequelize";
import { Assessment } from "../models/assessment.model";
import { error } from "console";

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

function isResponseBodyConfirm(data: any): data is ResponseBodyConfirm {
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

function isResponseBodyRideEstimate(data: any): data is RequestBody {
  return (
    typeof data === "object" &&
    typeof data.id === "string" && // Validar o tipo de id como string
    typeof data.origin === "string" &&
    typeof data.destination === "string"
  );
}
//"POST /ride/estimate"
router.post("/estimate", async (req: Request, res: Response) => {
  try {
    if (!isResponseBodyRideEstimate(req.body)) {
      return res
        .status(400)
        .json({
          error_code: "INVALID_DATA",
          error_description: "request body data is invalid",
        });
    }
    const { id, origin, destination }: RequestBody = req.body;

    if (!cpf.isValid(id)) {
      return res
        .status(400)
        .json({ error_code: "INVALID_PK", error_description: "INVALID CPF" });
    }

    let originCoordinates: coordinatesInterface = { latitude: 0, longitude: 0 };
    let destinationCoordinates: coordinatesInterface = {
      latitude: 0,
      longitude: 0,
    };

    if (!origin || !destination) {
      return res.status(400).json({
        error_code: "INVALID_ADRESS",
        error_description: "Empty origin and destination address",
      });
    }

    try {
      originCoordinates = await getLatLng(origin, client);
    } catch (error) {
      return res.status(400).json({
        error_code: "INVALID_ADRESS_ORIGIN",
        error_description: "Invalid source address",
      });
    }

    try {
      destinationCoordinates = await getLatLng(destination, client);
    } catch (error) {
      return res.status(400).json({
        error_code: "INVALID_ADRESS_DESTINATION",
        error_description: "Invalid destination address",
      });
    }

    if (
      JSON.stringify(originCoordinates) ===
      JSON.stringify(destinationCoordinates)
    ) {
      return res.status(400).json({
        error_code: "INVALID_ADRESS_EQUALS",
        error_description: "Addresses cannot be the same",
      });
    }

    const response: DistanceMatrixResponse = await client.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        key: process.env.GOOGLE_API_KEY!,
      },
    });

    const result: DistanceMatrixRowElement = response.data.rows[0].elements[0];

    if (result.status !== "OK") {
      return res
        .status(400)
        .json({ error_code: "INVALID_ROUTE", error_description: "It is not possible to trace a route to this address" });
    }

    const distance: string = result.distance.text;
    const distanceNumber: number = parseFloat(distance.replace(/[^\d.]/g, ""));

    if (distanceNumber < 1) {
      return res.status(400).json({
        error_code: "INVALID_DISTANCE",
        error_description: "Distance less than 1 km",
      });
    }
    const duration: string = result.duration.text;

    //Consultando os motoristas que atendem ao requisito de Kilometragem minima
    const driversWithMinKm: Driver[] = await Driver.findAll({
      where: {
        minKm: {
          [Op.lt]: distanceNumber,
        },
      },
    });

    const driversAndValues: DriverAttributes[] = await Promise.all(
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

    const objectResponse: ResponseBodyRideEstimate = {
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
    res
      .status(500)
      .json({ error_code: "INTERNAL_SERVER_ERROR", error_description: "" });
  }
});

//"PATCH /ride/confirm"
router.patch("/confirm", async (req: Request, res: Response) => {
  try {
    //Validando dados de entrada
    if (!isResponseBodyConfirm(req.body)) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "The data provided is not valid!",
      });
    }
    const data: ResponseBodyConfirm = req.body;

    //Validando se o motorista existe
    const drivers: Driver[] = await Driver.findAll({
      where: {
        id: data.driver.id,
      },
    });

    if (!drivers) {
      return res.status(400).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Driver not found!",
      });
    }

    //Validando quilometragem
    const driverResult: DriverAttributes = drivers[0];
    if (data.distance < driverResult.minKm) {
      return res.status(400).json({
        error_code: "INVALID_DISTANCE",
        error_description: "Distance less than the driver's minimum mileage!",
      });
    }

    const trip: Trip = await Trip.create({
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
        return res
          .status(400)
          .json({ error_code: "INVALID_DRIVER", error_description: "" });
      }
    }

    let listTrips: Trip[] = await Trip.findAll({
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
