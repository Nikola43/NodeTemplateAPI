import * as nodemailer from "nodemailer";
require('dotenv').config();

class MailUtil {

    constructor(
        public to?: string,
        public subject?: string,
        public message?: string) {
    }


    sendMail() {

        let mailOptions = {
            from: "info@stelast.com",
            to: this.to,
            subject: this.subject,
            html: this.message
        };

        const transporter = nodemailer.createTransport({
            host: "ssl0.ovh.net",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });


        console.log(mailOptions);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return error;
            } else {
                return "E-mail enviado com sucesso!";
            }
        });
    }


}

export default new MailUtil();
