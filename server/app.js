require("dotenv").config();
const log = require("./util/log");
const express = require("express");
const app = express();
// const jose = require("./modules/jose");
// jose.fetchBlacklist();
const authService = require("./modules/authentication");
const helmet = require("helmet");

// -- MIDDLEWARE -- //
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/favicon.ico', express.static('favicon.ico'));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// -- ROUTES -- //
app.use("/authentication", require("./routes/authentication"));

app.use("/signin/email", require("./routes/signin/email"));
app.use("/signin/password", require("./routes/signin/password"));
app.use("/signin/forgot", require("./routes/signin/forgot"));
app.use("/reset", require("./routes/signin/reset"));

app.use("/signup/user", require("./routes/signup/user"));
app.use("/signup/individual", require("./routes/signup/individual"));
app.use("/signup/organisation", require("./routes/signup/organisation"));

app.use("/signout", require("./routes/signout"));

app.use("/verify/email", require("./routes/verify/email"));
app.use("/verify/phone", require("./routes/verify/phone"));
app.use("/verify/identity", require("./routes/verify/identity"));

app.use("/error", require("./routes/error"));
app.use("/bugreport", require("./routes/bugreport"));
app.use("/notification", require("./routes/notification"));
app.use("/information", require("./routes/information"));
app.use("/settings", require("./routes/settings"));

app.use("/causes", require("./routes/causes"));
app.use("/causes/select", require("./routes/causes/select"));

app.use("/event", require("./routes/event"));

app.use("/profile/edit", require("./routes/profile/edit"));
app.use("/profile/delete", require("./routes/profile/delete"));
app.use("/profile/edit/password", require("./routes/profile/edit/password"));
app.use("/profile", require("./routes/profile"));

app.use("/avatar", require("./routes/avatar"));
app.use("/picture", require("./routes/picture"));

app.use("/admin", require("./routes/admin"));
app.use("/admin/information", require("./routes/admin/information"));

// import OAuth routes and dependencies if applicable
if (process.env.NODE_ENV !== 'test') {
    log.info("OAUTH enabled: %s, AUTH enabled: %s", process.env.ENABLE_OAUTH === "1", process.env.NO_AUTH === "0");
}

/* istanbul ignore if */
if (process.env.ENABLE_OAUTH === 1) {
    const passport = require("passport");
    require("./modules/authentication/passport/");
    app.use(passport.initialize());
    app.use("signin/oauth/facebook", require("./routes/signin/OAuth/facebook"));
    app.use("signin/oauth/google", require("./routes/signin/OAuth/google"));
    app.use("signin/oauth/linkedin", require("./routes/signin/OAuth/linkedin"));
}

// wildcard-protect any unspecified route
app.all("*", authService.requireAuthentication);

module.exports = app;
