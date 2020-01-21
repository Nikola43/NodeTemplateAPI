import {Model, DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class MultimediaContent extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public user_id!: number;
    public location_id!: number | null;
    public type_id!: number;
    public name!: string;
    public url!: string;
    public size!: number | null;

    // timestamps!
    public createdAt!: Date;
    public updated_at!: Date | null;
    public deletedAt!: Date | null;
}

MultimediaContent.init({
    id: {
        type: new DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: new DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    location_id: {
        type: new DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    type_id: {
        type: new DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: new DataTypes.STRING(32),
        allowNull: false,
    },
    url: {
        type: new DataTypes.STRING(256),
        allowNull: false,
    },
    size: {
        type: new DataTypes.BIGINT(),
        allowNull: false,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'multimedia_contents',
    sequelize: dbConnection.getSequelize, // this bit is important
});
