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

config.scheduler = {
    recache: {
        hour: 4,
        minute: 30,
        dayOfWeek: 3, // 0 is Sunday
    },
    deleteExports: {
        hour: 4,
        minute: 20,
    },
};

module.exports = config;
