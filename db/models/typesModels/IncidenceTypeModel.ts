import { DataTypes } from 'sequelize';
import dbConnection from "../../../utils/DBUtil";
import {BaseTypeModel} from "../baseModels/BaseTypeModel";

export class IncidenceTypeModel extends BaseTypeModel {
}

IncidenceTypeModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: new DataTypes.STRING(32),
        allowNull: false,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'incidences_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});