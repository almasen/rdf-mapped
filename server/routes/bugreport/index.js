/**
 * @module Send-bug-report
 */
const log = require("../../util/log");
const express = require("express");
const router = express.Router();
const mailSender = require("../../modules/mail/index");
const httpUtil = require("../../util/http");
const authService = require("../../modules/authentication/");

/**
 * Attempt send a bug report to admin email account.
 * This requires a contact email address to be provided/input
 * by the app user (as bugs may occur when a user is not
 * signed-in). Returns success or an error message from
 * the mailSender module.
 <p><b>Route: </b>/bugreport (POST)</p>
 <p><b>Permissions: </b>any</p>
 * @param {string} req.headers.authorization authToken or null
 * @param {object} req.body.data.email user input email address
 * @param {object} req.body.data.report user input bug report
 * @param {object} req.body Here are some examples of an appropriate request json:
<pre><code>
    &#123;
        "data": &#123;
            "email": "icantlogin@gmail.com",
            "report": "I can't sign-in to the app and don't receive a token. Help pls!",
        &#125;
    &#125;
</code></pre>
 * @return {object} one of the following HTTP responses:<br/>
 * - if email successfully sent, 200 - bug report sent<br/>
 * - if any error, 400 - error msg from mailSender module
 * @name Send bug report
 * @function
 */
router.post("/", authService.acceptAnyAuthentication, async (req, res) => {
    try {
        log.info("%s (user id '%d'): Sending bug report", req.body.data.email, req.body.userId);
        const result = await mailSender.sendBugReport(req.body.data.email, req.body.data.report);
        httpUtil.sendResult(result, res);
    } catch (e) {
        log.error("%s (user id '%d'): Sending bug report failed " + e, req.body.data.email, req.body.userId);
        httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
