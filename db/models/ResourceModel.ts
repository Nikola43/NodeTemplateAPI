import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../managers/DBManager";
import { ResourceTypeModel } from './typesModels/ResourceTypeModel';
import {CenterModel} from "./CenterModel";
import {BaseModel} from "./baseModels/BaseModel";

export class ResourceModel extends BaseModel {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public center_id!: number;
    public type_id!: number;
    public name!: string;
    public status!: number;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

ResourceModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    center_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: new DataTypes.STRING(64),
        allowNull: false,
    },
    status: {
        type: new DataTypes.TINYINT(),
        allowNull: false
    },
    deletedAt: {
        type: new DataTypes.DATE(),
        allowNull: true
    },
}, {
    tableName: 'resources',
    sequelize: dbConnection.getSequelize, // this bit is important
});


ResourceModel.hasOne(ResourceTypeModel, {sourceKey: 'type_id', foreignKey: 'id', as: 'type'});
//ResourceModel.belongsTo(CenterModel, {targetKey: 'id', foreignKey: 'center_id', as: 'center'});

ResourceModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));
ResourceTypeModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));
