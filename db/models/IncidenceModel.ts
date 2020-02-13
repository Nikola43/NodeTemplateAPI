import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../managers/DBManager";
import {BaseModel} from "./baseModels/BaseModel";
import { IncidenceTypeModel } from './typesModels/IncidenceTypeModel';
import {DeviceTypeModel} from "./typesModels/DeviceTypeModel";
import {DeviceModel} from "./DeviceModel";
import {LocationModel} from "./LocationModel";
import {CenterModel} from "./CenterModel";

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
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    level: {
        type: DataTypes.INTEGER.UNSIGNED,
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

IncidenceModel.hasOne(IncidenceTypeModel, {sourceKey: 'type_id', foreignKey: 'id', as: 'type'});
IncidenceModel.hasOne(LocationModel, {sourceKey: 'location_id', foreignKey: 'id', as: 'location'});

IncidenceModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));
IncidenceTypeModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));
