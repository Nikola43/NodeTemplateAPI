import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class Device extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type_id!: number;
    public name!: string;
    public description!: string;
    public phone!: string;

    // timestamps!
    public readonly created_at!: Date;
    public updated_at!: Date | null;
    public deleted_at!: Date | null;
}

Device.init({
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
        type: new DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: new DataTypes.DATE,
        allowNull: true
    },
    phone: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'coordinates',
    sequelize: dbConnection.getSequelize, // this bit is important
});
