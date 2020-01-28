import {Model} from 'sequelize';

export class BaseModel extends Model {
    public id!: number;
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}
