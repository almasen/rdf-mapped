/**
 * @module submission
 */
const submissionRepo = require("../../repositories/submission");
const digest = require("../digest");
const linkedinAPI = require("../linkedin_learning");
const log = require("../../util/log");
const courseService = require("../course");
const videoService = require("../video");
const mail = require("../mail");
const util = require("../../util/");
const capabilityService = require("../capability");
const categoryService = require("../category");
const competencyService = require("../competency");

/**
 * Fetch submission from database by id.
 * @param {String} id
 * @return {Object} submission object
 */
const fetchById = async (id) => {
    const findResult = await submissionRepo.findById(id);
    if (findResult.rows.length === 0) {
        throw new Error("No submission found with ID - " + id);
    }
    return findResult.rows[0];
};

/**
 * Fetch all submissions from database.
 * @return {Array} submissions
 */
const fetchAll = async () => {
    const findResult = await submissionRepo.findAll();
    return findResult.rows;
};
/**
 * Generate unique submission id by hashing
 * the email, timestamp and server secret.
 * @param {String} email
 * @param {String} timestamp
 * @return {String} unique submission id
 */
const generateSubmissionID = (email, timestamp) => {
    return util.base64ToURLSafe(
        digest.hashVarargInBase64(
            email,
            timestamp,
            process.env.SERVER_SECRET,
        ),
    );
};

/**
 * Update the status of a submission
 * to rejected.
 * @param {String} id
 */
const rejectSubmission = async (id) => {
    const submission = await fetchById(id);
    submission.status = 'rejected';
    await updateSubmission(submission);
};

/**
 * Map a submission to given RDF parameters and
 * update record in database.
 * @param {String} id
 * @param {Number} capability id of capability
 * @param {Number} category id of category
 * @param {Number} competency id of competency
 * @param {any} phases array or single id number
 */
const mapSubmission = async (id, capability, category, competency, phases) => {
    const submission = await fetchById(id);
    submission.data.capability = capability;
    submission.data.category = category;
    submission.data.competency = competency;
    submission.data.phases = phases;
    const capabilityObj = await capabilityService.fetchById(capability);
    const categoryObj = await categoryService.fetchById(category);
    const competencyObj = await competencyService.fetchById(competency);
    submission.data.capabilityTitle = capabilityObj.title;
    submission.data.categoryTitle = categoryObj.title;
    submission.data.competencyTitle = competencyObj.title;
    await updateSubmission(submission);
};

/**
 * Publish a submission: insert it as a new learning object and
 * update its status to published.
 * @param {String} id
 */
const publishSubmission = async (id) => {
    const submission = await fetchById(id);
    if (!submission.data.urn) {
        throw new Error("Mustn't publish submission without a URN!");
    }
    if (!submission.data.capability) {
        throw new Error("Mustn't publish submission without an RDF mapping!");
    }
    submission.data.type === "COURSE" ?
        await courseService.addNewCourse(submission.data) :
        await videoService.addNewVideo(submission.data);
    submission.status = "published";
    await updateSubmission(submission);
};

/**
 * Insert new submission in the database and send
 * tracking link to user if an email was provided.
 * @param {String} type course / video
 * @param {String} title
 * @param {String} hyperlink
 * @param {String} email
 */
const insertNewSubmission = async (type, title, hyperlink, email) => {
    const timestamp = (new Date()).toUTCString();
    const id = generateSubmissionID(email, timestamp);
    const insertionResult = await submissionRepo.insert({
        id,
        status: "processing",
        submitter: email ? email : "anonymous",
        data: {timestamp, type, title, hyperlink},
    });
    if (email) {
        mail.sendEmail(
            process.env.SUBMISSION_EMAIL_ADDRESS,
            email,
            "Your RDFmapped Content Submission",
            `Thank you very much for submitting content to the RDFmapped website, we really appreciate the contribution.\n` +
            `You can track the progress of you submission via the following link: https://rdfmapped.com/submission/${id}`,
            `<p>Thank you very much for submitting content to the RDFmapped website, we really appreciate the contribution.</p>` +
            `You can track the progress of you submission via the following link: ` +
            `<a href="https://rdfmapped.com/submission/${id}" target="_blank" rel="noopener noreferrer">` +
            `https://rdfmapped.com/submission/${id}</a>`);
    }
    attemptToFindURN(insertionResult.rows[0]);
};

/**
 * Verify the integrity of a submission via the LinkedIn
 * Learning API and update its status accordingly.
 * Upon success, the submission's Unique Resource Identifier
 * is set to match the LinkedIn Learning URN.
 * @param {Object} submission
 */
const attemptToFindURN = async (submission) => {
    try {
        log.info("Attempting to find URN for submission(%s)", submission.id);
        const result = await linkedinAPI.fetchURNByContent(submission, submission.data.type);
        if (result) {
            log.info("Found URN(%s) for submission(%s)", result, submission.id);
            submission.data.urn = result;
        }
        submission.status = result ? "pending" : "failed";
        await updateSubmission(submission);
    } catch (error) {
        log.error("Finding URN for submission(%s) failed, err: " +
            error.message, submission.id);
    }
};

/**
 * Update a submission object in the database.
 * @param {Object} submission
 */
const updateSubmission = async (submission) => {
    await submissionRepo.update(submission);
};

module.exports = {
    fetchById,
    insertNewSubmission,
    fetchAll,
    rejectSubmission,
    publishSubmission,
    mapSubmission,
};
