import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";
import { Driver } from "./driver.model";

export interface TripAttributes {
  id: number;
  origin: string;
  destination: string;
  customer_id: string;
  value: number;
  distance: number;
  id_driver: number;
  driver_name: string;
  duration: string;
}

interface TripCreationAttributes extends Optional<TripAttributes, "id"> {}

class Trip
  extends Model<TripAttributes, TripCreationAttributes>
  implements TripAttributes
{
  public id!: number;
  public origin!: string;
  public destination!: string;
  public customer_id!: string;
  public value!: number;
  public distance!: number;
  public id_driver!: number;
  public driver_name!: string;
  public duration!: string;

  static associate() {
    //uma viagem pertence a um motorista
    this.belongsTo(Driver, {
      foreignKey: "id_driver",
      as: "driver", 
    });
  }
}

Trip.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "trips",
    modelName: "Trip",
    timestamps: true, 
  }
);

export { Trip };
