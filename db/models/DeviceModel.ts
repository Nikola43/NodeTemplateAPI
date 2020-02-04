import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class DeviceModel extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public type_id!: number;
    public name!: string;
    public description!: string | null;
    public phone!: string | null;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

DeviceModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type_id: {
        type: new DataTypes.DOUBLE,
        allowNull: false,
    },
    name: {
        type: new DataTypes.STRING(64),
        allowNull: false,
    },
    description: {
        type: new DataTypes.STRING(256),
        allowNull: true
    },
    phone: {
        type: new DataTypes.STRING(32),
        allowNull: true
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'devices',
    sequelize: dbConnection.getSequelize, // this bit is important
});

DeviceModel.sync( //Crea la tabla de centros en la base de datos desde sequelize
    { force: false } // Si la tabla existe no provoca error ya que no obliga a crearla (con true si lo haría)
)
.then(() => 
    console.log("Tabla de coordenadas creada o ya existe.")
);