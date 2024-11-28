import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";
import { Driver } from "./driver.model";

export interface AssessmentAttributes {
  id: number;
  rating: number;
  comment: string ;
  driverId: number; 
}

interface AssessmentCreationAttributes
  extends Optional<AssessmentAttributes, "id"> {}

class Assessment
  extends Model<AssessmentAttributes, AssessmentCreationAttributes>
  implements AssessmentAttributes
{
  public id!: number;
  public rating!: number;
  public comment!: string;
  public driverId!: number;

  static associate() {
    this.belongsTo(Driver, {
      foreignKey: "driverId",
      as: "driver",
    });
  }
}

Assessment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "assessments",
    modelName: "Assessments",
    timestamps: false,
  }
);

export { Assessment };
