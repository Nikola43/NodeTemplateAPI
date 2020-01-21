import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class ResourceType extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public updated_at!: Date | null;
    public deleted_at!: Date | null;
}

ResourceType.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: new DataTypes.STRING(64),
        allowNull: false,
    },
    deleted_at: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'resources_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
