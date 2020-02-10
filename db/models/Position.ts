import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

export class Position extends Model {
    public Id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public Latitude!: number;
    public Longitude!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}

Position.init({
    Id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    Latitude: {
        type: new DataTypes.DOUBLE,
        allowNull: false,
    },
    Longitude: {
        type: new DataTypes.DOUBLE,
        allowNull: false,
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'positions',
    sequelize: dbConnection.getSequelize, // this bit is important
});

Position.sync( //Crea la tabla de centros en la base de datos desde sequelize
    { force: false } // Si la tabla existe no provoca error ya que no obliga a crearla (con true si lo haría)
)
.then(() => 
    console.log("Tabla de coordenadas creada o ya existe.")
);
