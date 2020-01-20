import {Model, DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class MultimediaContentType extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type!: string;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

MultimediaContentType.init({
    id: {
        type: new DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'multimedia_contents_types',
    sequelize: dbConnection.getSequelize, // this bit is important
});
