const submissionRepo = require("../../repositories/submission");
const digest = require("../digest");
const linkedinAPI = require("../linkedin_learning");
const log = require("../../util/log");
const courseService = require("../course");
const videoService = require("../video");
const mail = require("../mail");
const util = require("../../util/");

const fetchById = async (id) => {
    const findResult = await submissionRepo.findById(id);
    if (findResult.rows.length === 0) {
        throw new Error("No submission found with ID - " + id);
    }
    return findResult.rows[0];
};

const fetchAll = async () => {
    const findResult = await submissionRepo.findAll();
    return findResult.rows;
};

const generateSubmissionID = (email, timestamp) => {
    return util.base64ToURLSafe(
        digest.hashVarargInBase64(
            email,
            timestamp,
            process.env.SUBMISSION_SIG_KEY,
        ),
    );
};

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
            `You can track the progress of you submission via the following link: https://rdfmapped.com/submission/${id}`);
    }
    console.log(insertionResult.rows[0]);
    attemptToFindURN(insertionResult.rows[0]);
};

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

const publishSubmission = async (submission) => {
    submission.type === "COURSE" ?
        await courseService.addNewCourse(submission) :
        await videoService.addNewVideo(submission);
};

const updateSubmission = async (submission) => {
    const updateResult = await submissionRepo.update(submission);
    console.log(updateResult.rows[0]);
};

module.exports = {
    fetchById,
    insertNewSubmission,
    fetchAll,
};
