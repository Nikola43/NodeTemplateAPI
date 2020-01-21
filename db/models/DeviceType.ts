import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class DeviceType extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
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
        allowNull: false,
    },
    deleted_at: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'devices_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
