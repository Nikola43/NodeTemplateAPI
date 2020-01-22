import {Model, DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class PanicButton extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public user_id!: number;
    public description!: string | null;
    public cause!: string | null;
    public number!: number | null;
    public endAt!: Date | null;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

PanicButton.init({
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
    description: {
        type: new DataTypes.STRING(256),
        allowNull: true,
    },
    cause: {
        type: new DataTypes.STRING(64),
        allowNull: true,
    },
    number: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    endAt: {
        type: new DataTypes.DATE,
        allowNull: true,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'panic_buttons',
    sequelize: dbConnection.getSequelize, // this bit is important
});
