require("dotenv").config();
const log = require("./util/log");
const express = require("express");
const flash = require('express-flash');
const session = require('express-session');
const app = express();
const helmet = require("helmet");
const methodOverride = require('method-override');
const path = require('path');
const downloadService = require("./modules/download");

const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

// -- MIDDLEWARE -- //
app.set('view-engine', 'ejs');
// app.set("view cache", true); // TODO: enable view cache
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
    store: new RedisStore({
        client: redisClient,
    }),
}));
app.use(methodOverride('_method'));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

downloadService.deleteExportFiles();

// // -- ROUTES -- //
app.use("/", require("./routes/root"));

app.use("/course", require("./routes/course"));
app.use("/video", require("./routes/video"));

app.use("/search", require("./routes/search"));
app.use("/download", require("./routes/download"));
app.use("/features", require("./routes/features"));
app.use("/about", require("./routes/about"));
app.use("/support", require("./routes/support"));
app.use("/contact", require("./routes/contact"));

app.use("/admin/login", require("./routes/admin/login"));
app.use("/admin/panel", require("./routes/admin/panel"));

app.use("/error", require("./routes/error"));
// app.use("/bugreport", require("./routes/bugreport"));
// app.use("/information", require("./routes/information"));

// app.use("/capability", require("./routes/capability"));

app.use("/submit", require("./routes/submit"));
app.use("/submit/course", require("./routes/submit/course"));
app.use("/submit/video", require("./routes/submit/video"));
app.use("/submission", require("./routes/submission"));

// // wildcard-protect
app.all("*", function(req, res, next) {
    res.status(404).render('404.ejs', {
        baseurl: "",
    });
});

log.info(`App started successfully in ${process.env.NODE_ENV} environment...`);
log.info(`View cache is ${app.get("view cache") ? "enabled" : "disabled"}`);


// Fetch content after start-up

const courseService = require("./modules/course");
const videoService = require("./modules/video");
const cache = require("./modules/cache");

(async () => {
    try {
        await courseService.fetchAll();
        await videoService.fetchAll();
        await cache.updateAllFromAPI();
    } catch (error) {
        log.error("Failed to fetch content on start-up, err: " + error.message);
    }
})();

module.exports = app;
