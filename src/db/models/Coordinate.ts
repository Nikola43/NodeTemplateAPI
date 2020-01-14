import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../connect";

export class Coordinate extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public lat!: number;
    public lon!: number;

    // timestamps!
    public readonly created_at!: Date;
    public updated_at!: Date | null;
    public deleted_at!: Date | null;
}

Coordinate.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    lat: {
        type: new DataTypes.DOUBLE,
        allowNull: true,
    },
    lon: {
        type: new DataTypes.DOUBLE,
        allowNull: false,
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
    tableName: 'coordinates',
    sequelize: dbConnection.getSequelize, // this bit is important
});
