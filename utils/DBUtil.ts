import DBActions from "../constants/DBActions";
import {Op} from "sequelize";
import {LOGUtil} from "./LOGUtil";
import {CenterModel} from "../db/models/CenterModel";

export class DBUtil {
    static async insertModel(controller: any, model: any, data: any) {
        try {
            return await CenterModel.create(data);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog(controller.name + ' - ' + DBActions.INSERT + '\r\n' + e);
            return e;
        }
    }

    static async updateModel(controller: any, model: any, data: any) {
        try {
            return await model.update(data,
                {
                    where: {
                        id: {
                            [Op.eq]: data.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog(controller.name + ' - ' + DBActions.DELETE + '\r\n' + e);
            return e;
        }
    }

    static async checkIfExistsByField(controller: any, model: any, fieldName: string, fieldValue: any): Promise<boolean> {
        let exists = false;

        // find if exists any record with same value field
        try {
            const tempData = await model.findOne({
                attributes: [
                    fieldName,
                ], where: {
                    fieldName: {
                        [Op.eq]: fieldValue
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // if already exist
            // send conflict error
            if (tempData) {
                exists = true;
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog(controller.name + ' - ' + DBActions.DELETE + '\r\n' + e);
            return e;
        }
        return exists;
    }
}

