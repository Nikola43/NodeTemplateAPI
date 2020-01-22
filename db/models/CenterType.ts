import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class CenterType extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type!: string;
    public temporary!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

CenterType.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: new DataTypes.STRING(32),
        allowNull: false,
    },
    temporary: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'centers_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
