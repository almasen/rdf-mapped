/**
 * @module jose
 */
const jose = require('jose');
const config = require("../../config").jose;
const fs = require("fs");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWT, // JSON Web Token (JWT)
} = jose;

/**
 * Import encryption key if user sessions are configured to be
 * preserved on reboot or synchronously generate an encryption
 * key with config-defined type and curve/size.
 */
const encKey = (
    process.env.PRESERVE_SESSIONS_ON_REBOOT === '1' ?
        JWK.asKey({
            key: fs.readFileSync("./keys/enc.key"),
            format: "pem",
            passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
        },
        {
            alg: config.alg,
            use: "enc",
        }) :
        JWK.generateSync(config.kty, config.crvOrSize, {
            alg: config.alg,
            use: "enc",
            key_ops: ["deriveKey"],
        })
);

/**
 * Import signing key if user sessions are configured to be
 * preserved on reboot or synchronously generate a signing
 * key with config-defined type and curve/size.
 */
const sigKey = (
    process.env.PRESERVE_SESSIONS_ON_REBOOT === '1' ?
        JWK.asKey({
            key: fs.readFileSync("./keys/sig.key"),
            format: "pem",
            passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
        },
        {
            use: "sig",
            alg: config.sigAlg,
        }) :
        JWK.generateSync(config.kty, config.crvOrSize, {
            alg: config.sigAlg,
            use: "sig",
            key_ops: ["sign", "verify"],
        })
);

/**
 * Initialise JSON Web Key Store
 */
const keystore = new JWKS.KeyStore(encKey, sigKey);

/**
 * Get the public key used for encryption-decryption
 * in Privacy-Enhanced Mail format
 * @return {object} enc public key in PEM format
 */
const getEncPubAsPEM = () => {
    return keystore.get({
        kty: config.kty,
        crv: config.crvOrSize,
        use: "enc",
        key_ops: ["deriveKey"],
    }).toPEM();
};

/**
 * Get the public key used for signing-verifying
 * in Privacy-Enhanced Mail format
 * @return {object} sig public key in PEM format
 */
const getSigPubAsPEM = () => {
    return keystore.get({
        kty: config.kty,
        crv: config.crvOrSize,
        use: "sig",
        key_ops: ["sign", "verify"],
    }).toPEM();
};

/**
 * Encrypt given cleartext with specified public
 * key and return the resulting JWE object as a string.
 * If no public key is provided by the recipient and
 * symmetric encryption is enabled, the JWT is symmetrically
 * encrypted by the server's key instead.
 * In case asymmetric encryption is enforced and the client
 * does not provide a public key, an error is thrown.
 * @param {string} cleartext
 * @param {object} pub JWK compatible public key of recipient
 * @return {string} JWE object as string
 */
const encrypt = (cleartext, pub) => {
    if (pub === undefined && process.env.SYMMETRIC_ENC_ENABLED === '1') {
        pub = encKey;
    };
    return JWE.encrypt(cleartext, JWK.asKey(pub),
        {
            enc: config.enc,
            alg: config.alg,
        });
};

/**
 * Decrypt given JWK object with owned
 * private key and return cleartext as a
 * utf8 string.
 * @param {string} jwe JWE object as string
 * @return {string} cleartext (utf8)
 */
const decrypt = (jwe) => {
    return JWE.decrypt(jwe, encKey, {
        complete: false,
    }).toString("utf8");
};

/**
 * Sign provided payload and return the
 * signed JWT.
 * @param {JSON} payload
 * @param {string} [exp=default] default expiry will be used if omitted
 * @return {string} signed JWT
 */
const sign = (payload, exp) => {
    return JWT.sign(payload, sigKey, {
        header: {
            typ: "JWT",
        },
        issuer: config.iss,
        audience: config.aud,
        kid: true,
        expiresIn: exp !== undefined ? exp : config.exp,
    });
};

/**
 * Verify provided JWT with given params and
 * the server's signing key.
 * The audience may also be optionally provided,
 * for instance when validating access to routes
 * with custom permissions. An example is when
 * an unauthenticated user wishes to reset their
 * password and have been granted access via a
 * reset token. In this case the aud="/reset".
 * If the audience param is left out, the default
 * configuration will be used.
 * @param {object} jwt JWT token
 * @param {string} [aud=default] default config will be used if omitted
 * @return {string} payload
 * @throws {JWSVerificationFailed} if JWT blacklisted
 * @throws {jose.errors} for failed verification
 */
const verify = (jwt, aud) => {
    return JWT.verify(jwt, sigKey, {
        audience: aud !== undefined ? aud : config.aud,
        complete: false,
        issuer: config.iss,
    });
};

/**
 * Sign provided payload with the server's private
 * key and asymmetrically encrypt the signed JWT by
 * the client provided public key.
 * This returns the encrypted JWE object as a string.
 * @param {JSON} payload
 * @param {object} pub client's pub used for encryption
 * @param {string} [exp=default] default expiry will be used if omitted
 * @return {string} JWE object as string
 */
const signAndEncrypt = (payload, pub, exp) => {
    const jwt = sign(payload, exp);
    return encrypt(jwt, pub);
};

/**
 * Decrypt given JWE with the server's encryption
 * key and verify resulting JWT with the server's
 * signing key. Returns the payload object if
 * successful.
 * @param {string} jwe JWE object as string
 * @param {string} [aud=default] default config will be used if omitted
 * @return {string} decrypted and verified payload
 */
const decryptAndVerify = (jwe, aud) => {
    const jwt = decrypt(jwe);
    return verify(jwt, aud);
};

module.exports = {
    getEncPubAsPEM,
    getSigPubAsPEM,
    encrypt,
    decrypt,
    sign,
    verify,
    signAndEncrypt,
    decryptAndVerify,
};
