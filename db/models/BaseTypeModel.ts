import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class BaseTypeModel extends Model {
    public static className: string;
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

BaseTypeModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    sequelize: dbConnection.getSequelize, // this bit is important
});
