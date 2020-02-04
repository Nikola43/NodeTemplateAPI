import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import {BaseModel} from "./baseModels/BaseModel";

export class IncidenceModel extends BaseModel {
    public user_id!: number;
    public location_id!: number;
    public type_id!: number;
    public incidence_room!: string;
    public name!: string;
    public description!: string | null;
    public subtype!: number;
    public status!: boolean;
    public level!: boolean;
    public perimeter!: number | null;
    public area!: number | null;
    public strategy!: string | null;
    public tactic!: string | null;
    public maneuver!: string | null;
    public endAt!: Date | null;
}

IncidenceModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    location_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    incidence_room: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
    name: {
        type: new DataTypes.STRING(32),
        allowNull: false,
    },
    description: {
        type: new DataTypes.STRING(32),
        allowNull: true,
    },
    subtype: {
        type: new DataTypes.STRING(32),
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    level: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    perimeter: {
        type: new DataTypes.DOUBLE,
        allowNull: true,
    },
    area: {
        type: new DataTypes.DOUBLE,
        allowNull: true,
    },
    strategy: {
        type: new DataTypes.STRING(32),
        allowNull: true,
    },
    tactic: {
        type: new DataTypes.STRING(32),
        allowNull: true,
    },
    maneuver: {
        type: new DataTypes.STRING(32),
        allowNull: true,
    },
    endAt: {
        type: new DataTypes.DATE,
        allowNull: true,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'incidences',
    sequelize: dbConnection.getSequelize, // this bit is important
});

IncidenceModel.sync( //Crea la tabla de centros en la base de datos desde sequelize
    { force: false } // Si la tabla existe no provoca error ya que no obliga a crearla (con true si lo haría)
)
.then(() => 
    console.log("Tabla de incidencias creada o ya existe.")
);