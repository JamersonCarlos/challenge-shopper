import { sequelize } from "../config/sequelize";
import { Driver } from "./driver.model";
import { Assessment } from "./assessment.model";
import { Trip } from "./trip.model";

const db = {
  Driver,
  Assessment,
  Trip,
  sequelize,
};

export { db };
