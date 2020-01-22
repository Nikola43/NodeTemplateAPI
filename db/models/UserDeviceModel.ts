import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class UserDeviceModel extends Model {
    public user_id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public device_id!: number;
    public endAt!: Date | null;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

UserDeviceModel.init({
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
    device_id: {
        type: new DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
    end_at: {
        type: new DataTypes.DATE,
        allowNull: true
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'users_devices',
    sequelize: dbConnection.getSequelize, // this bit is important
});
