import {Model} from 'sequelize';

export class BaseModel extends Model {
    public readonly createdAt!: Date;
    public updatedAt!: Date | null;
    public deletedAt!: Date | null;
}
