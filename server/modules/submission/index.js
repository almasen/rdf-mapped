const submissionRepo = require("../../repositories/submission");
const digest = require("../digest");
const linkedinAPI = require("../linkedin_learning");
const log = require("../../util/log");
const courseService = require("../course");
const videoService = require("../video");
const mail = require("../mail");

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

const insertNewSubmission = async (submission) => {
    const timestamp = (new Date()).toUTCString();
    submission.timestamp = timestamp;
    submission.id = digest.hashVarargInHex(
        submission.email,
        timestamp,
        process.env.SUBMISSION_SIG_KEY,
    );
    submission.status = "processing";
    submission.submitter = submission.email ?
        submission.email :
        "anonymous";
    submission.authenticationStatus = submission.password ?
        digest.hashPassWithSaltInHex(submission.password, process.env.SUBMISSION_SALT) === process.env.SUBMISSION_PASSWORD ?
            1 : -1 : 0, // 0 if no password, 1 if correct, -1 if incorrect
    delete submission.password;
    submission.data = JSON.stringify(submission);
    await submissionRepo.insert(submission);
    if (submission.email) {
        mail.sendEmail(
            process.env.SUBMISSION_EMAIL_ADDRESS,
            submission.email,
            "Your RDFmapped Content Submission",
            `Thank you very much for submitting content to the RDFmapped website, we really appreciate the contribution.\n` +
            `You can track the progress of you submission via the following link: https://rdfmapped.com/submission/${submission.id}`);
    }
    await attemptToFindURN(submission);
};

const attemptToFindURN = async (submission) => {
    try {
        log.info("Attempting to find URN for submission(%s)", submission.id);
        const result = await linkedinAPI.fetchURNByContent(submission, submission.type);
        if (result) {
            log.info("Found URN(%s) for submission(%s)", result, submission.id);
            submission.urn = result;
            if (submission.authenticationStatus === 1) {
                log.info("Publishing submission(%s)..", submission.id);
                await publishSubmission(submission);
                submission.publishedAt = (new Date).toUTCString();
                submission.status = "published";
            } else {
                submission.status = "pending";
            }
            await updateSubmission(submission);
        } else {
            submission.status = "failed";
            await updateSubmission(submission);
        }
    } catch (error) {
        log.error("Finding URN for submission(%s) or publishing failed, err: " + error.message, submission.id);
    }
};

const publishSubmission = async (submission) => {
    submission.type === "COURSE" ?
        await courseService.addNewCourse(submission) :
        await videoService.addNewVideo(submission);
};

const updateSubmission = async (submission) => {
    log.info("Updating submission(%s) status to %s", submission.id, submission.status);
    delete submission.data;
    submission.data = JSON.stringify(submission);
    await submissionRepo.update(submission);
};

module.exports = {
    fetchById,
    insertNewSubmission,
    fetchAll,
};
