import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class DocumentType extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

DocumentType.init({
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
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'documents_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
