import express from "express";
import * as UserController from "../controllers/user_controller";
const router = express.Router();

/* GET ALL USERS */
router.get("/users", UserController.getAll);

/* GET USER BY ID */
router.get("/users/:id", UserController.getUserById);

/* INSERT USER */
router.post("/users", UserController.insertUser);

/* UPDATE USER BY ID*/
router.patch("/users/:id", UserController.updateUser);

/* DELETE USER BY ID*/
router.delete("/users/:id", UserController.deleteUser);

module.exports = router;
