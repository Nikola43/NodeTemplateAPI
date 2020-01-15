import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../connect";

export class DocumentType extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type!: number;

    // timestamps!
    public readonly created_at!: Date;
    public updated_at!: Date | null;
    public deleted_at!: Date | null;
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
    updated_at: {
        type: new DataTypes.DATE,
        allowNull: true
    },
    deleted_at: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'documents_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
