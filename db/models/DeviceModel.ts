import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import { DeviceTypeModel } from './typesModels/DeviceTypeModel';

export class DeviceModel extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type_id!: number;
    public name!: string;
    public description!: string | null;
    public phone!: string | null;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

DeviceModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type_id: {
        type: new DataTypes.DOUBLE,
        allowNull: false,
    },
    name: {
        type: new DataTypes.STRING(64),
        allowNull: false,
    },
    description: {
        type: new DataTypes.STRING(256),
        allowNull: true
    },
    phone: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'devices',
    sequelize: dbConnection.getSequelize, // this bit is important
});

DeviceModel.hasOne(DeviceTypeModel, {sourceKey: 'type_id', foreignKey: 'id', as: 'Type'});

DeviceModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));

DeviceTypeModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));