import {DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import {BaseTypeModel} from "./BaseTypeModel";

export class CenterModel extends BaseTyp eModel {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public location_id!: number;
    public type_id!: number;
    public name!: string;
    public description!: string | null;
    public phone!: string | null;
    public email!: string | null;
    public leader!: string | null;
    public schedule!: string | null;
    public endAt!: Date | null;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

CenterModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    location_id: {
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
    description: {
        type: new DataTypes.STRING(150),
        allowNull: true
    },
    phone: {
        type: new DataTypes.STRING(15),
        allowNull: true
    },
    email: {
        type: new DataTypes.STRING(100),
        allowNull: true
    },
    leader: {
        type: new DataTypes.STRING(15),
        allowNull: true
    },
    schedule: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    endAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'centers',
    sequelize: dbConnection.getSequelize, // this bit is important
});
