import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class Document extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public user_id!: number;
    public type_id!: number;
    public name!: string;
    public description!: string | null;
    public url!: string;
    public end_at!: string | null;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

Document.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: new DataTypes.STRING(32),
        allowNull: false,
    },
    description: {
        type: new DataTypes.STRING(255),
        allowNull: true,
    },
    url: {
        type: new DataTypes.STRING(255),
        allowNull: false,
    },
    end_at: {
        type: new DataTypes.DATE,
        allowNull: true,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'documents',
    sequelize: dbConnection.getSequelize, // this bit is important
});
