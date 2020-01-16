import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class Center extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public location_id!: number;
    public type_id!: number;
    public name!: string;
    public description!: string;
    public phone!: string;
    public email!: string;
    public leader!: string | null;
    public schedule!: string | null;
    public end_at!: Date | null;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

Center.init({
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
        allowNull: false
    },
    phone: {
        type: new DataTypes.STRING(15),
        allowNull: false
    },
    email: {
        type: new DataTypes.STRING(100),
        allowNull: false
    },
    leader: {
        type: new DataTypes.STRING(15),
        allowNull: false
    },
    schedule: {
        type: new DataTypes.STRING(32),
        allowNull: true
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
    tableName: 'centers',
    sequelize: dbConnection.getSequelize, // this bit is important
});
