import ErrnoException = NodeJS.ErrnoException;

const fs = require('fs');


export class LOGUtil {

    constructor() {
    }

    public static saveLog(message: string) {
        let current_datetime = new Date();
        let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();
        console.log(formatted_date);
        let formatted_hour = current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        try {
            fs.appendFile('/var/log/signis/' + formatted_date.toString() + '.txt', formatted_date.toString() + ' ' + formatted_hour.toString() + ' - ' + message + '\r\n', (err: Error) => {
                if (err) throw err;
            });
        } catch (e) {
            console.log(e)
        }

    }
}

