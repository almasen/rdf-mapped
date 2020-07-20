const config = {};

config.linkedinLearningAPI = {
    ttl: 6, // in days
};

config.jose = {
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ECDH-ES+A128KW",
    enc: "A128GCM",
    iss: "rdfmapped.com",
    exp: "30 d",
    aud: "RDFmapped.com/admin",
    sigAlg: "ES256",
};

module.exports = config;
