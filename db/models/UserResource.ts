import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class UserResource extends Model {
    public user_id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public resource_id!: number;
    public endAt!: Date | null;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

UserResource.init({
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
    resource_id: {
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
    tableName: 'users_resources',
    sequelize: dbConnection.getSequelize, // this bit is important
});
