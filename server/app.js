require("dotenv").config();
const log = require("./util/log");
const express = require("express");
const session = require('express-session');
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");

// Initialise application
const app = express();

// -- Session store -- //
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

// -- App config -- //
app.set('view-engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));
// app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(helmet({
    hsts: false, // enabled in higher level server conf
}));
app.use(cookieParser()); // if secret is specified, it should match session secret
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/favicon.ico', express.static(path.join(__dirname, 'assets/favicon/favicon_new.ico')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
        client: redisClient,
    }),
}));
app.use(csrf({cookie: true}));
app.use((req, res, next) => {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, {secure: true, httpOnly: true});
    res.locals.csrfToken = token;
    next();
});

// -- DDoS / bruteforce protection -- //
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter); //  apply to all requests

// -- Routes -- //
app.use("/", require("./routes/root"));
// Learning content
app.use("/course", require("./routes/course"));
app.use("/courses", require("./routes/courses"));
app.use("/video", require("./routes/video"));
app.use("/videos", require("./routes/videos"));
// Search content
app.use("/search", require("./routes/search"));
// Download content
app.use("/download", require("./routes/download"));
// Content submission
app.use("/submit", require("./routes/submit"));
app.use("/submission", require("./routes/submission"));

// Information routes
app.use("/about", require("./routes/information/about"));
app.use("/privacy", require("./routes/information/privacy"));
app.use("/accessibility", require("./routes/information/accessibility"));
// Faqs
app.use("/support", require("./routes/support"));

// Contact routes
app.use("/contact", require("./routes/contact"));
app.use("/bugreport", require("./routes/bugreport"));

// Admin routes
app.use("/admin/login", require("./routes/admin/login"));
app.use("/admin", require("./routes/admin"));
app.use("/admin/information", require("./routes/admin/information"));
app.use("/admin/faq", require("./routes/admin/faq"));
app.use("/admin/faq/new", require("./routes/admin/faq/new"));
app.use("/admin/faq/edit", require("./routes/admin/faq/edit"));
app.use("/admin/faq/delete", require("./routes/admin/faq/delete"));
app.use("/admin/submissions", require("./routes/admin/submissions"));
app.use("/admin/content", require("./routes/admin/content"));
app.use("/admin/content/edit", require("./routes/admin/content/edit"));

// API routes (might be added in the future)
// app.use("/api/capability", require("./routes/capability"));
// app.use("/api/category", require("./routes/category"));
// app.use("/api/competency", require("./routes/competency"));
// app.all("/api/*", requireAPIAuth) // TODO: API authentication

// Wildcard-catch non-matching addresses
app.all("*", (req, res) => {
    res.status(404).render('404.ejs', {
        baseurl: "",
    });
});


// -- App startup logs -- //
log.info(`App started successfully in ${process.env.NODE_ENV} environment...`);
log.info(`View cache is ${app.get("view cache") ? "ENABLED" : "DISABLED"}`);
log.info(`Trust proxy is ${app.get("trust proxy") ? "ENABLED" : "DISABLED"}`);
log.info("Logging at level: %s", log.level);

module.exports = app;
