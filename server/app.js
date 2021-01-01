const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const uploadRouter = require("./routes/upload.js");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();

app.use(fileUpload({ limits: { fileSize: 150 * 1024 * 1024 } }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/upload", uploadRouter);

module.exports = app;
