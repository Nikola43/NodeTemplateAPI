import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class UserResource extends Model {
    public user_id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public resource_id!: number;
    public endAt!: Date | null;

    // timestamps!
    public readonly created_at!: Date;
    public updated_at!: Date | null;
    public deleted_at!: Date | null;
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
    deleted_at: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'users_resources',
    sequelize: dbConnection.getSequelize, // this bit is important
});
