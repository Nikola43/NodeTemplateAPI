import {Model, DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public center_id!: number | null;
    public username!: string;
    public password!: string;
    public token!: string;
    public name!: string | null;
    public lastname!: string | null;
    public status!: boolean | null;
    public rank!: string;
    public role!: string | null;
    public email!: string;
    public phone!: string | null;
    public available!: boolean | null;
    public gender!: string | null;
    public age!: number | null;
    public weight!: number | null;
    public height!: number | null;
    public blood_type!: string | null;
    public pulsations_max_rest!: number | null;
    public vo2_max!: number | null;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

User.init({
    id: {
        type: new DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    center_id: {
        type: new DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    username: {
        type: new DataTypes.STRING(64),
        allowNull: false,
    },
    password: {
        type: new DataTypes.STRING(256),
        allowNull: false,
    },
    token: {
        type: new DataTypes.STRING(256),
        allowNull: true,
    },
    name: {
        type: new DataTypes.STRING(32),
        allowNull: true,
    },
    lastname: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    status: {
        type: new DataTypes.TINYINT(4),
        allowNull: true
    },
    rank: {
        type: new DataTypes.STRING(32),
        allowNull: false
    },
    role: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    email: {
        type: new DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: new DataTypes.STRING(15),
        allowNull: true
    },
    available: {
        type: new DataTypes.TINYINT(1),
        allowNull: true
    },
    gender: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    age: {
        type: new DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    weight: {
        type: new DataTypes.DOUBLE(5, 2),
        allowNull: true
    },
    height: {
        type: new DataTypes.DOUBLE(5, 2),
        allowNull: true
    },
    blood_type: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    pulsations_max_rest: {
        type: new DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    vo2_max: {
        type: new DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'users',
    sequelize: dbConnection.getSequelize, // this bit is important
});
