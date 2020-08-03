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

const rejectSubmission = async (id) => {
    const submission = await fetchById(id);
    console.log(submission);
    submission.status = 'rejected';
    await updateSubmission(submission);
};

const publishSubmission = async (id) => {
    const submission = await fetchById(id);
    if (!submission.data.urn) {
        throw new Error("Mustn't publish submission without a URN!");
    }
    if (!submission.data.capabilityId) {
        throw new Error("Mustn't publish submission without an RDF mapping!");
    }
    submission.type === "COURSE" ?
        await courseService.addNewCourse(submission) :
        await videoService.addNewVideo(submission);
    submission.status = "published";
    await updateSubmission(submission);
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

const updateSubmission = async (submission) => {
    await submissionRepo.update(submission);
};

module.exports = {
    fetchById,
    insertNewSubmission,
    fetchAll,
    rejectSubmission,
    publishSubmission,
};
