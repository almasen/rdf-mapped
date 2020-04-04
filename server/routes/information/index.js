/**
 * @module Information
 */
const log = require("../../util/log");
const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/http");
const informationService = require("../../modules/information/");
const authService = require("../../modules/authentication/");

/**
 * Endpoint called whenever a user requests information about an information type.<br/>
 * URL example: GET http://localhost:8000/information?type=privacyPolicy
 <p><b>Route: </b>/information (GET)</p>
 <p><b>Permissions: </b>any</p>
 * @param {string} req.headers.authorization authToken or null
 * @param {String} req.query.type - type of information
 * @returns {Object}
 *  status: 200, description: The information of the requested type.<br/>
 *  status: 400, description: Wrong input format.
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "Information entry fetched successfully.",
    "data": {
        "information": {
            "type": "privacyPolicy",
            "content": "Private"
        }
    }
 }
 </pre>
 *  @name Get information entry
 *  @function
 */
router.get("/", authService.acceptAnyAuthentication, async (req, res) => {
    try {
        log.info("%s: Getting information type '%s'", req.query.userId ? `User id '${req.query.userId}'` : "No auth",
            req.query.type);
        const type = req.query.type;
        if (type === undefined) {
            return res.status(400).send({message: "Type is not specified"});
        }

        const informationResult = await informationService.getInformationData(type);
        return httpUtil.sendResult(informationResult, res);
    } catch (e) {
        log.error("%s: Failed getting information type '%s'", req.query.userId ? `User id '${req.query.userId}'` : "No auth",
            req.query.type);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
