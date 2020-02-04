import { DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import {BaseModel} from "./baseModels/BaseModel";

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


UserModel.sync( //Crea la tabla de centros en la base de datos desde sequelize
    { force: false } // Si la tabla existe no provoca error ya que no obliga a crearla (con true si lo haría)
)
.then(() => 
    console.log("Tabla de usuario creada o ya existe.")
);