import {DataTypes} from 'sequelize';
import dbConnection from "../../../utils/DBUtil";
import {BaseTypeModel} from "../baseModels/BaseTypeModel";
import { CenterModel } from '../CenterModel';

export class CenterTypeModel extends BaseTypeModel {
    public temporary!: number;
}

CenterTypeModel.init({
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
    temporary: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'centers_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});