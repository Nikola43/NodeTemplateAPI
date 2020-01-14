import {Model, DataTypes } from 'sequelize';
import dbConnection from "../../connect";

export class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public name!: string;
    public preferredName!: string | null; // for nullable fields

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    preferredName: {
        type: new DataTypes.STRING(128),
        allowNull: true
    }
}, {
    tableName: 'users',
    sequelize: dbConnection.getSequelize, // this bit is important
});
