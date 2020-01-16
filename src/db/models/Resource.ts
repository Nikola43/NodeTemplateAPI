import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class Resource extends Model {
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

Resource.init({
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
        type: new DataTypes.TINYINT(4),
        allowNull: false
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
    tableName: 'resources',
    sequelize: dbConnection.getSequelize, // this bit is important
});
