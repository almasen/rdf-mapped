const config = {};

config.jose = {
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ECDH-ES+A128KW",
    enc: "A128GCM",
    iss: "https://karma.laane.xyz/",
    exp: "30 d",
    aud: "/user",
    sigAlg: "ES256",
};

config.josePermissions = {
    "/admin": "/admin",
    "/reset": "/reset",
    "/": "/user",
};

config.emailVerification = {
    validMinutes: 30,
    tokenLength: 6,
};

config.passwordReset = {
    validMinutes: 15,
    tokenLength: 6,
};

module.exports = config;
