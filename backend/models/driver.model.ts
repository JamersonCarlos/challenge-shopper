import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";
import { Assessment } from "./assessment.model";

export interface DriverAttributes {
  id: number;
  name: string;
  description: string;
  car: string;
  ratePerKm: number;
  minKm: number;
  value?: number;
  review?: review; 
}

interface review { 
  rating: number, 
  comment: string, 
}



interface DriverCreationAttributes extends Optional<DriverAttributes, "id"> {}

class Driver
  extends Model<DriverAttributes, DriverCreationAttributes>
  implements DriverAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public car!: string;
  public ratePerKm!: number;
  public minKm!: number;

  static associate() {
    this.hasMany(Assessment, {
      foreignKey: "driverId",
      as: "assessments",
    });
  }
}

Driver.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    car: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ratePerKm: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "drivers",
    modelName: "Driver",
    timestamps: false,
  }
);

export { Driver };
