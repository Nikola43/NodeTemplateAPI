import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../../managers/DBManager";
import {BaseModel} from "./BaseModel";

export class BaseTypeModel extends BaseModel {
    public type!: number;
}

BaseTypeModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    sequelize: dbConnection.getSequelize, // this bit is important
});
