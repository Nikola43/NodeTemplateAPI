import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../db/models/User";
import { Op } from "sequelize";
import bcrypt from "bcrypt"

class AuthController {
    static login = async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.username;

        //Check if username and password are set
        if (!(username && password)) {
            res.status(400).send({ error: "username or password are empty" });
            return;
        }

        try {
            const user = await User.findOne({
                attributes: [
                    'username',
                    'password'
                ], where: {
                    username: {
                        [Op.eq]: username
                    },
                    deleted_at: {
                        [Op.is]: null
                    }
                }
            });
            console.log(user);
            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);
                //Check if encrypted password match
                if (passwordMatch) {
                    res.status(401).send();
                    return;
                }
                //Sing JWT, valid for 1 hour
                const token = jwt.sign(
                    { userId: user.id, username: user.username },
                    config.jwtSecret,
                    { expiresIn: "1h" }
                );
                //Send the jwt in the response
                res.send(token);
            } else {
                res.status(404).send({ error: "user not found" });
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;
        /*

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
          res.status(400).send();
        }

        //Get user from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
          user = await userRepository.findOneOrFail(id);
        } catch (id) {
          res.status(401).send();
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
          res.status(401).send();
          return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
        //Hash the new password and save
        user.hashPassword();
        userRepository.save(user);
        */

        res.status(204).send();
    };
}

export default AuthController;
