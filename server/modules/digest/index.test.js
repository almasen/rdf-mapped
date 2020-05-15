const digest = require("./");
const Base64 = require('js-base64').Base64;
const util = require("../../util");

test("hashing with base64 or hex digest yield the same result", async () => {
    const password = "password";
    const salt = digest.generateSecureSaltInBase64();
    const hashInBase64 = digest.hashPassWithSaltInBase64(password, salt);
    const hashInHex = digest.hashPassWithSaltInHex(password, salt);
    expect(util.base64ToHex(hashInBase64)).toStrictEqual(hashInHex);
});
