import { DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import {BaseTypeModel} from "./BaseTypeModel";

export class MultimediaContentTypeModel extends BaseTypeModel {
}

MultimediaContentTypeModel.init({
    id: {
        type: new DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'multimedia_contents_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
