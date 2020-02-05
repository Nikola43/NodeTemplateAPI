import * as nodemailer from "nodemailer";

class MailUtil {

    constructor(
        public to?: string,
        public subject?: string,
        public message?: string) {
    }


    sendMail() {

        let mailOptions = {
            from: "pauloxti@gmail.com",
            to: this.to,
            subject: this.subject,
            html: this.message
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pauloxti@gmail.com',
                pass: '-Hromi2020'
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
