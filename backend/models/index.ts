import { sequelize } from "../config/sequelize";
import { Driver } from "./driver.model";
import { Assessment } from "./assessment.model";

const db = {
  Driver,
  Assessment,
  sequelize,
};

export { db };
