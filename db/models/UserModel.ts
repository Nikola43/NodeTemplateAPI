import { DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import {BaseModel} from "./baseModels/BaseModel";
import { DocumentModel } from './DocumentModel';
import { MultimediaContentModel } from './MultimediaContentModel';
import { PanicButtonModel } from './PanicButtonModel';
import { UserDeviceModel } from './UserDeviceModel';
import { UserIncidenceModel } from './UserIncidenceModel';
import { UserResourceModel } from './UserResourceModel';
import { LocationModel } from './LocationModel';
import { LocationTypeModel } from './typesModels/LocationTypeModel';

export class UserModel extends BaseModel {
    public center_id!: number | null;
    public email!: string;
    public password!: string;
    public token!: string | null;
    public name!: string | null;
    public lastname!: string | null;
    public status!: boolean;
    public rank!: string | null;
    public role!: string | null;
    public phone!: string | null;
    public available!: number;
    public gender!: string | null;
    public age!: number | null;
    public weight!: number | null;
    public height!: number | null;
    public blood_type!: string | null;
    public pulsations_max_rest!: number | null;
    public vo2_max!: number | null;
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    center_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    email: {
        type: new DataTypes.STRING(100),
        allowNull: false
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
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    rank: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    role: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    phone: {
        type: new DataTypes.STRING(15),
        allowNull: true
    },
    available: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    gender: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER.UNSIGNED,
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
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    vo2_max: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'users',
    sequelize: dbConnection.getSequelize, // this bit is important
});

UserModel.hasMany(DocumentModel, {sourceKey: 'id', foreignKey: 'user_id', as: 'Documents'});
UserModel.hasMany(MultimediaContentModel, {sourceKey: 'id', foreignKey: 'user_id', as: 'Multimedia'});
UserModel.hasMany(PanicButtonModel, {sourceKey: 'id', foreignKey: 'user_id', as: 'Panics'});
UserModel.hasMany(UserDeviceModel, {sourceKey: 'id', foreignKey: 'user_id', as: 'Devices'});
UserModel.hasMany(UserIncidenceModel, {sourceKey: 'id', foreignKey: 'user_id', as: 'Incidences'});
UserModel.hasMany(UserResourceModel, {sourceKey: 'id', foreignKey: 'user_id', as: 'Resources'});

UserModel.sync({ force: false })
    .then(() => console.log("Tabla de usuario creada o ya existe."));
UserDeviceModel.sync({ force: false })
    .then(() => console.log("Tabla de dispositivos creada o ya existe."));
UserIncidenceModel.sync({ force: false })
    .then(() => console.log("Tabla de incidencias creada o ya existe."));
UserResourceModel.sync({ force: false })
    .then(() => console.log("Tabla de incidencias creada o ya existe."));
LocationModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));
LocationTypeModel.sync({ force: false })
        .then(() => console.log("Tabla de tipos centros creada o ya existe."));