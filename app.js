var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var usersRouter = require("./routes/users");
var filmRouter = require("./routes/films");
var courtRouter = require("./routes/courts");
let { authorize } = require("./utils/auth");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", usersRouter);
// all the routes given in the filmRouter shall be secure : call the authorize middleware
app.use("/api/films", filmRouter);
app.use("/api/courts", courtRouter);


module.exports = app;
