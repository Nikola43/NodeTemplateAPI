import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class DeviceType extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type!: string;

    // timestamps!
    public readonly created_at!: Date;
    public updated_at!: Date | null;
    public deleted_at!: Date | null;
}

DeviceType.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: new DataTypes.DOUBLE,
        allowNull: true,
    },
    updated_at: {
        type: new DataTypes.DATE,
        allowNull: true
    },
    deleted_at: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'devices_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
