import {Model, DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import {BaseModel} from "./baseModels/BaseModel";
import { MultimediaContentTypeModel } from './typesModels/MultimediaContentTypeModel';

export class MultimediaContentModel extends BaseModel {
    public user_id!: number;
    public location_id!: number | null;
    public type_id!: number;
    public name!: string;
    public url!: string;
    public size!: number | null;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

MultimediaContentModel.init({
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
        allowNull: true,
    },
    type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: new DataTypes.STRING(32),
        allowNull: false,
    },
    url: {
        type: new DataTypes.STRING(256),
        allowNull: false,
    },
    size: {
        type: new DataTypes.BIGINT(),
        allowNull: false,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'multimedia_contents',
    sequelize: dbConnection.getSequelize, // this bit is important
});

MultimediaContentModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));
MultimediaContentTypeModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));