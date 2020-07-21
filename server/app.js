require("dotenv").config();
const log = require("./util/log");
const express = require("express");
const flash = require('express-flash');
const session = require('express-session');
const app = express();
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const downloadService = require("./modules/download");
const recache = require("./modules/cache/recache");
const scheduler = require("./modules/scheduler");

const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const rateLimit = require("express-rate-limit");

// -- MIDDLEWARE -- //
app.set('view-engine', 'ejs');
// if (process.env.NODE_ENV === "production") app.set("view cache", true);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(helmet());
app.use(cookieParser());
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

// -- DDoS PROTECTION -- //
// Enable if you're behind a reverse proxy (AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// -- ROUTES -- //
app.use("/", require("./routes/root"));

app.use("/course", require("./routes/course"));
app.use("/courses", require("./routes/courses"));
app.use("/video", require("./routes/video"));
app.use("/videos", require("./routes/videos"));

app.use("/search", require("./routes/search"));
app.use("/download", require("./routes/download"));

// information routes
app.use("/about", require("./routes/information/about"));
app.use("/terms", require("./routes/information/terms"));
app.use("/privacy", require("./routes/information/privacy"));
app.use("/accessibility", require("./routes/information/accessibility"));

app.use("/support", require("./routes/support"));
app.use("/contact", require("./routes/contact"));

app.use("/admin/login", require("./routes/admin/login"));
app.use("/admin/dashboard", require("./routes/admin/dashboard"));

app.use("/bugreport", require("./routes/bugreport"));

// API
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
log.info(`View cache is ${app.get("view cache") ? "ENABLED" : "DISABLED"}`);


// -- Update content after start-up -- //
downloadService.deleteExportFiles();
recache.recacheAll();

// -- Schedule recurring tasks -- //
scheduler.scheduleAllTasks();


module.exports = app;
