import {Model, DataTypes} from 'sequelize';
import dbConnection from "../../managers/DBManager";
import {UserModel} from "./UserModel";
import {LocationModel} from "./LocationModel";



export class PanicButtonModel extends Model {
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

PanicButtonModel.init({
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

//UserModel.hasMany(PanicButtonModel, {sourceKey: 'id', foreignKey: 'user_id', as: 'resources'});
//PanicButtonModel.hasOne(LocationModel, {sourceKey: 'location_id', foreignKey: 'id', as: 'location'});
PanicButtonModel.hasOne(UserModel, {sourceKey: 'user_id', foreignKey: 'id', as: 'user'});


PanicButtonModel.sync( //Crea la tabla de centros en la base de datos desde sequelize
    { force: false } // Si la tabla existe no provoca error ya que no obliga a crearla (con true si lo haría)
)
.then(() => 
    console.log("Tabla de panicbutton creada o ya existe.")
);

