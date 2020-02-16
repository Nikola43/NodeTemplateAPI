import {Model, DataTypes} from 'sequelize';
import dbConnection from "../../managers/DBManager";
import {PositionModel} from "./PositionModel";
import {UserModel} from "./UserModel";
import {CenterTypeModel} from "./typesModels/CenterTypeModel";
import LocationsType from "../../routes/LocationsType";
import {LocationTypeModel} from "./typesModels/LocationTypeModel";

export class LocationModel extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public user_id!: number | null;
    public type_id!: number;
    public coordinates_id!: number ;
    public alt!: number | null;
    public name!: string | null;
    public description!: string | null;
    public projection!: string | null;
    public street!: string | null;
    public zipcode!: number | null;
    public town!: string | null;
    public district!: string | null;
    public province!: string | null;
    public region!: string | null;
    public state!: number | null;
    public number!: string | null;
    public coordination_area!: string | null;

    // timestamps!
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

LocationModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    coordinates_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    alt: {
        type: new DataTypes.DOUBLE,
        allowNull: true,
    },
    name: {
        type: new DataTypes.STRING(64),
        allowNull: true,
    },
    description: {
        type: new DataTypes.STRING(256),
        allowNull: true,
    },
    projection: {
        type: new DataTypes.STRING(256),
        allowNull: true,
    },
    street: {
        type: new DataTypes.STRING(32),
        allowNull: true,
    },
    zipcode: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    town: {
        type: new DataTypes.STRING(64),
        allowNull: true
    },
    district: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    province: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    region: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    state: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    number: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    coordination_area: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'locations',
    sequelize: dbConnection.getSequelize, // this bit is important
});

//LocationModel.belongsTo(UserModel, {targetKey: 'id', foreignKey: 'user_id', as: 'user'});
LocationModel.hasOne(PositionModel, {sourceKey: 'coordinates_id', foreignKey: 'id', as: 'position'});

LocationModel.sync({ force: false })
    .then(() => console.log("Tabla de centros creada o ya existe."));

LocationTypeModel.sync({ force: false })
    .then(() => console.log("Tabla de tipos centros creada o ya existe."));