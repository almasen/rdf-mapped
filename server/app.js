require("dotenv").config();
const log = require("./util/log");
const express = require("express");
const flash = require('express-flash');
const session = require('express-session');
const app = express();
const helmet = require("helmet");
const methodOverride = require('method-override');
const path = require('path');

// -- MIDDLEWARE -- //
app.set('view-engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use('/favicon.ico', express.static('favicon.ico'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(methodOverride('_method'));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// // -- ROUTES -- //
app.use("/", require("./routes/root"));

app.use("/course", require("./routes/course"));
app.use("/video", require("./routes/video"));

app.use("/search", require("./routes/search"));
app.use("/download", require("./routes/download"));
app.use("/features", require("./routes/features"));
app.use("/about", require("./routes/about"));
app.use("/faq", require("./routes/faq"));
app.use("/contact", require("./routes/contact"));
// app.use("/login", require("./routes/login")); // TODO: TBD
// app.use("/registration", require("./routes/registration")); // TODO: TBD

app.use("/error", require("./routes/error"));
app.use("/bugreport", require("./routes/bugreport"));
app.use("/information", require("./routes/information"));

app.use("/capability", require("./routes/capability"));

// // wildcard-protect
app.all("*", function(req, res, next) {
    res.render('404.ejs', {
        baseurl: "",
    });
});

log.info(`App started successfully in ${process.env.NODE_ENV} environment...`);

module.exports = app;
