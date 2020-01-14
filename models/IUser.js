"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var mongoose = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true }
});
var IUser = mongoose.model("IUser", UserSchema);
exports["default"] = IUser;
