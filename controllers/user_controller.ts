import { Request, Response } from "express";
import IUser from "../models/IUser";

export const getAll = (req: Request, res: Response) => {
  const users = IUser.find((err: any, users: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(users);
    }
  });
};

export const getUserById = (req: Request, res: Response) => {
  const user = IUser.findById(req.params.id, (err: any, user: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
};

export const insertUser = (req: Request, res: Response) => {
  const user = new IUser(req.body);
  user.save((err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
};

export const updateUser = (req: Request, res: Response) => {
  const user = IUser.findByIdAndUpdate(
    req.params.id,
    req.body,
    (err: any, user: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(user);
      }
    }
  );
};

export const deleteUser = (req: Request, res: Response) => {
  const user = IUser.deleteOne({ _id: req.params.id }, (err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Iuser deleted from database");
    }
  });
};
