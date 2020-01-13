import mongoose, { Schema, Document } from "mongoose";

export interface UserInterface extends Document {
  username: string;
  name: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true }
});

const IUser = mongoose.model<UserInterface>("IUser", UserSchema);
export default Ibook;
