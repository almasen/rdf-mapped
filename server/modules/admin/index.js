const adminRepo = require("../../repositories/admin");
const jose = require("../jose");
const digest = require("../digest");
const config = require("../../config").jose.aud;

const logInAdmin = async (email, password) => {
    const findResult = await adminRepo.findByEmail(email);
    if (findResult.rows.length === 0) {
        throw new Error("Invalid admin email.");
    }
    const admin = findResult.rows[0];
    if (digest.hashPassWithSaltInHex(password, admin.salt) === admin.passwordHash) {
        return jose.signAndEncrypt({
            sub: admin.id.toString(),
            name: admin.username,
            email: email,
        });
    } else {
        throw new Error("Invalid admin password.");
    }
};

/**
 * Attempt to authenticate admin
 * by JWE. Upon successful verification,
 * the admin's (user)name is returned.
 * Otherwise, a JWE or JWT error is thrown.
 * @param {Object} jwe
 * @return {string} name of admin
 */
const authenticateAdmin = (jwe) => {
    return jose.decryptAndVerify(jwe, config).name;
};

module.exports = {
    logInAdmin,
    authenticateAdmin,
};
