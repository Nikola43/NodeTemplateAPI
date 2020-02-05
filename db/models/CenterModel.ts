import {DataTypes} from 'sequelize';
import dbConnection from "../../utils/DBUtil";
import {BaseModel} from "./baseModels/BaseModel";
import {CenterTypeModel} from "./typesModels/CenterTypeModel"

export class CenterModel extends BaseModel {
    public location_id!: number;
    public type_id!: number;
    public name!: string;
    public description!: string | null;
    public phone!: string | null;
    public email!: string | null;
    public leader!: string | null;
    public schedule!: string | null;
    public endAt!: Date | null;
    static associate: (models: any) => void;
}

CenterModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    location_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: new DataTypes.STRING(64),
        allowNull: false,
    },
    description: {
        type: new DataTypes.STRING(150),
        allowNull: true
    },
    phone: {
        type: new DataTypes.STRING(15),
        allowNull: true
    },
    email: {
        type: new DataTypes.STRING(100),
        allowNull: true
    },
    leader: {
        type: new DataTypes.STRING(15),
        allowNull: true
    },
    schedule: {
        type: new DataTypes.STRING(32),
        allowNull: true
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
    tableName: 'centers',
    sequelize: dbConnection.getSequelize, // this bit is important
});

CenterModel.associate = (models) => {
    CenterModel.hasOne(models.CenterTypeModel, {foreignKey: 'type_id', as: 'type'});
};
  

CenterModel.sync( //Crea la tabla de centros en la base de datos desde sequelize
        { force: false } // Si la tabla existe no provoca error ya que no obliga a crearla (con true si lo haría)
    )
    .then(() => 
        console.log("Tabla de centros creada o ya existe.")
    );
