import { DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import {BaseTypeModel} from "./BaseTypeModel";

export class DeviceTypeModel extends BaseTypeModel {
}

DeviceTypeModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: new DataTypes.STRING(64),
        allowNull: false,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'devices_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
