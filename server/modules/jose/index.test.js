process.env.PRESERVE_SESSIONS_ON_REBOOT = '0';
const jose = require('jose');
const Base64 = require('js-base64').Base64;
const util = require("../../util");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = jose;
const testHelpers = require("../../test/helpers");

const joseOnServer = require("./");


beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("JWT signing with default and custom exp work", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);
    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));

    const jwtWithCustomExp = joseOnServer.sign(payload, "15 m");
    const jwtWithCustomExpSplit = jwtWithCustomExp.split(".");
    const jwtWithCustomExpHeader = JSON.parse(Base64.decode(jwtWithCustomExpSplit[0]));
    const jwtWithCustomExpPayload = JSON.parse(Base64.decode(jwtWithCustomExpSplit[1]));

    expect(jwtHeader).toStrictEqual(jwtWithCustomExpHeader);
    expect(jwtPayload.sub).toStrictEqual(jwtWithCustomExpPayload.sub);
    expect(jwtPayload.aud).toStrictEqual(jwtWithCustomExpPayload.aud);
    expect(jwtPayload.iss).toStrictEqual(jwtWithCustomExpPayload.iss);
    expect(jwtPayload.exp).not.toStrictEqual(jwtWithCustomExpPayload.exp);
});

test("JWT that's expired is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload, "0s");

    await util.sleep(10);

    expect(() => {
        joseOnServer.verify(jwt);
    }).toThrow(new errors.JWTExpired("\"exp\" claim timestamp check failed"));

    expect(() => {
        joseOnServer.verify(jwt);
    }).toThrow(errors.JWTClaimInvalid);

    expect(() => {
        joseOnServer.verify(jwt);
    }).toThrow(errors.JWTExpired);
});

test("JWT with non-matching audience is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    expect(() => {
        joseOnServer.verify(jwt, "/admin");
    }).toThrow(new errors.JWTClaimInvalid("unexpected \"aud\" claim value"));

    expect(() => {
        joseOnServer.verify(jwt, "/admin");
    }).toThrow(errors.JWTClaimInvalid);
});

test("JWT with invalid type is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.typ = 'invalidType';

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with invalid key-id is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.kid = jwtHeader.kid.substring(jwtHeader.length - 5) + "abcde";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with invalid algorithm is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.alg = "ES384";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWKKeySupport("the key does not support " + jwtHeader.alg + " verify algorithm"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWKKeySupport);
});

test("JWT with modified expiry is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);
    const jwk = joseOnServer.getSigPubAsPEM();

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.exp = 1589909685;

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified issue date is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.iat = 1584316685;

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified issuer is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.iss = "https://karmaaaaaapp.com";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified audience is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.aud = "/admin";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified audience and forged claim is also rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.aud = "/admin";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt, "/admin");
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt, "/admin");
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified subject is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.sub = "2";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified subject and forged claim is also rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.sub = "2";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with forged signature is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    const malformedSig = jwtSignature.substring(jwtSignature - 5) + "abcde";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        malformedSig;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWE key retrieval as PEM and en/decryption work", async () => {
    const cleartext = "karma";

    const serverPub = joseOnServer.getEncPubAsPEM();

    const jwe = joseOnServer.encrypt(cleartext, serverPub);

    const decryptionResult = joseOnServer.decrypt(jwe);

    expect(decryptionResult).toBe(cleartext);
});

test("JWE auth token generation works", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    process.env.SYMMETRIC_ENC_ENABLED = 1;

    const jwe = joseOnServer.signAndEncrypt(payload);

    const decryptionResult = joseOnServer.decryptAndVerify(jwe);

    expect(decryptionResult.sub).toBe(payload.sub);
});
