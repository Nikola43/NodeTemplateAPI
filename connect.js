"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
exports["default"] = (function (db) {
    var connect = function () {
        mongoose
            .connect(db, { useNewUrlParser: true })
            .then(function () {
            return console.log("Successfully connected to " + db);
        })["catch"](function (error) {
            console.log("Error connecting to database: ", error);
            return process.exit(1);
        });
    };
    connect();
    mongoose.connection.on("disconnected", connect);
});
