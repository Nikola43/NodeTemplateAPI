import { Model, DataTypes } from 'sequelize';
import dbConnection from "../../utils/DBUtil";

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
        type: new DataTypes.INTEGER.UNSIGNED,
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

UserIncidenceModel.sync( //Crea la tabla de centros en la base de datos desde sequelize
    { force: false } // Si la tabla existe no provoca error ya que no obliga a crearla (con true si lo haría)
)
.then(() => 
    console.log("Tabla de incidencias creada o ya existe.")
);