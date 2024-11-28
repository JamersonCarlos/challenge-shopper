import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";
import { Assessment } from "./assessment.model";

export interface DriverAttributes {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  ratePerKm: number;
  minKm: number;
  photoProfile?: string | null; 
  photoCar?: string | null;
  value?: number;
  review?: review; 
  registeredSince?: number | null; 
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
  public vehicle!: string;
  public ratePerKm!: number;
  public minKm!: number;
  public photoProfile?: string | null; 
  public photoCar?: string | null;
  public registeredSince?: number | null;

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
    vehicle: {
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
    photoProfile: { 
      type: DataTypes.STRING, 
      allowNull: true, 
    }, 
    photoCar: { 
      type: DataTypes.STRING, 
      allowNull: true, 
    }, 
    registeredSince: { 
      type: DataTypes.INTEGER, 
      allowNull: true, 
    }
  },
  {
    sequelize,
    tableName: "drivers",
    modelName: "Driver",
    timestamps: false,
  }
);

export { Driver };
