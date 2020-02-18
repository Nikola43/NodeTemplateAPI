import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../managers/DBManager";
import {UserModel} from "./UserModel";
import {IncidenceModel} from "./IncidenceModel";

export class UserIncidenceModel extends Model {
    public user_id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public incidence_id!: number;
    public endAt!: Date | null;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

UserIncidenceModel.init({
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
    incidence_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
    endAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'users_incidences',
    sequelize: dbConnection.getSequelize, // this bit is important
});

UserIncidenceModel.sync({ force: false })
    .then(() => console.log("Tabla de users_incidences creada o ya existe."));