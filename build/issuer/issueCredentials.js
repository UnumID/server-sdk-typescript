"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueCredential = void 0;
var config_1 = require("../config");
var requireAuth_1 = require("../requireAuth");
var library_issuer_verifier_utility_1 = require("library-issuer-verifier-utility");
var logger_1 = __importDefault(require("../logger"));
/**
 * Creates an object of type EncryptedCredentialOptions which encapsulates information relating to the encrypted credential data
 * @param cred Credential
 * @param authorization String
 */
var constructEncryptedCredentialOpts = function (cred, authorization) { return __awaiter(void 0, void 0, void 0, function () {
    var subjectDid, didDocResponse, publicKeyInfos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                subjectDid = cred.credentialSubject.id;
                return [4 /*yield*/, library_issuer_verifier_utility_1.getDIDDoc(config_1.configData.SaaSUrl, authorization, subjectDid)];
            case 1:
                didDocResponse = _a.sent();
                if (didDocResponse instanceof Error) {
                    throw didDocResponse;
                }
                publicKeyInfos = library_issuer_verifier_utility_1.getKeyFromDIDDoc(didDocResponse.body, 'RSA');
                if (publicKeyInfos.length === 0) {
                    throw new library_issuer_verifier_utility_1.CustError(404, 'Public key not found for the DID');
                }
                // create an encrypted copy of the credential with each RSA public key
                return [2 /*return*/, publicKeyInfos.map(function (publicKeyInfo) {
                        var subjectDidWithKeyFragment = subjectDid + "#" + publicKeyInfo.id;
                        var encryptedData = library_issuer_verifier_utility_1.doEncrypt(subjectDidWithKeyFragment, publicKeyInfo, cred);
                        var encryptedCredentialOptions = {
                            credentialId: cred.id,
                            subject: subjectDidWithKeyFragment,
                            issuer: cred.issuer,
                            type: cred.type,
                            data: encryptedData
                        };
                        return encryptedCredentialOptions;
                    })];
        }
    });
}); };
/**
 * Creates a signed credential with all the relevant information. The proof serves as a cryptographic signature.
 * @param usCred UnsignedCredential
 * @param privateKey String
 */
var constructSignedCredentialObj = function (usCred, privateKey) {
    var proof = library_issuer_verifier_utility_1.createProof(usCred, privateKey, usCred.issuer, 'pem');
    var credential = {
        '@context': usCred['@context'],
        credentialStatus: usCred.credentialStatus,
        credentialSubject: usCred.credentialSubject,
        issuer: usCred.issuer,
        type: usCred.type,
        id: usCred.id,
        issuanceDate: usCred.issuanceDate,
        expirationDate: usCred.expirationDate,
        proof: proof
    };
    return (credential);
};
/**
 * Creates all the attributes associated with an unsigned credential.
 * @param credOpts CredentialOptions
 */
var constructUnsignedCredentialObj = function (credOpts) {
    var credentialId = library_issuer_verifier_utility_1.getUUID();
    var unsCredObj = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        credentialStatus: {
            id: config_1.configData.SaaSUrl + "/credentialStatus/" + credentialId,
            type: 'CredentialStatus'
        },
        credentialSubject: credOpts.credentialSubject,
        issuer: credOpts.issuer,
        type: credOpts.type,
        id: credentialId,
        issuanceDate: new Date(),
        expirationDate: credOpts.expirationDate
    };
    return (unsCredObj);
};
/**
 * Handle input validation.
 * @param type
 * @param issuer
 * @param credentialSubject
 * @param eccPrivateKey
 */
var validateInputs = function (type, issuer, credentialSubject, eccPrivateKey, expirationDate) {
    if (!type) {
        // type element is mandatory, and it can be either string or an array
        throw new library_issuer_verifier_utility_1.CustError(400, 'type is required.');
    }
    if (!issuer) {
        throw new library_issuer_verifier_utility_1.CustError(400, 'issuer is required.');
    }
    if (!credentialSubject) {
        throw new library_issuer_verifier_utility_1.CustError(400, 'credentialSubject is required.');
    }
    if (!eccPrivateKey) {
        throw new library_issuer_verifier_utility_1.CustError(400, 'eccPrivateKey is required.');
    }
    // id must be present in credentialSubject input parameter
    if (!credentialSubject.id) {
        throw new library_issuer_verifier_utility_1.CustError(400, 'Invalid credentialSubject: id is required.');
    }
    if (!Array.isArray(type) && typeof type !== 'string') {
        throw new library_issuer_verifier_utility_1.CustError(400, 'type must be an array or a string.');
    }
    if (typeof issuer !== 'string') {
        throw new library_issuer_verifier_utility_1.CustError(400, 'issuer must be a string.');
    }
    if (typeof eccPrivateKey !== 'string') {
        throw new library_issuer_verifier_utility_1.CustError(400, 'eccPrivateKey must be a string.');
    }
    // expirationDate must be a Date object and return a properly formed time. Invalid Date.getTime() will produce NaN
    if (expirationDate && (!(expirationDate instanceof Date) || isNaN(expirationDate.getTime()))) {
        throw new library_issuer_verifier_utility_1.CustError(400, 'expirationDate must be a valid Date object.');
    }
    if (expirationDate && expirationDate < new Date()) {
        throw new library_issuer_verifier_utility_1.CustError(400, 'expirationDate must be in the future.');
    }
};
var constructCredentialOptions = function (type, issuer, credentialSubject, eccPrivateKey, expirationDate) {
    var lType = ['VerifiableCredential'].concat(type);
    var credOpt = {
        credentialSubject: credentialSubject,
        issuer: issuer,
        type: lType,
        expirationDate: expirationDate
    };
    return (credOpt);
};
/**
 * Handles issuing a credential with UnumID's SaaS.
 *
 * @param authorization
 * @param type
 * @param issuer
 * @param credentialSubject
 * @param eccPrivateKey
 * @param expirationDate
 */
exports.issueCredential = function (authorization, type, issuer, credentialSubject, eccPrivateKey, expirationDate) { return __awaiter(void 0, void 0, void 0, function () {
    var credentialOptions, unsignedCredential, credential, encryptedCredentialOptions, encryptedCredentialUploadOptions, restData, restResp, authToken, issuedCredential, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                // The authorization string needs to be passed for the SaaS to authorize getting the DID document associated with the holder / subject.
                requireAuth_1.requireAuth(authorization);
                // Validate the inputs
                validateInputs(type, issuer, credentialSubject, eccPrivateKey, expirationDate);
                credentialOptions = constructCredentialOptions(type, issuer, credentialSubject, eccPrivateKey, expirationDate);
                unsignedCredential = constructUnsignedCredentialObj(credentialOptions);
                credential = constructSignedCredentialObj(unsignedCredential, eccPrivateKey);
                return [4 /*yield*/, constructEncryptedCredentialOpts(credential, authorization)];
            case 1:
                encryptedCredentialOptions = _a.sent();
                encryptedCredentialUploadOptions = {
                    credentialId: credential.id,
                    subject: credential.credentialSubject.id,
                    issuer: credential.issuer,
                    type: credential.type,
                    encryptedCredentials: encryptedCredentialOptions
                };
                restData = {
                    method: 'POST',
                    baseUrl: config_1.configData.SaaSUrl,
                    endPoint: 'credentialRepository',
                    header: { Authorization: authorization },
                    data: encryptedCredentialUploadOptions
                };
                return [4 /*yield*/, library_issuer_verifier_utility_1.makeNetworkRequest(restData)];
            case 2:
                restResp = _a.sent();
                authToken = library_issuer_verifier_utility_1.handleAuthToken(restResp);
                issuedCredential = { body: credential, authToken: authToken };
                return [2 /*return*/, issuedCredential];
            case 3:
                error_1 = _a.sent();
                logger_1.default.error("Error issuing a credential with UnumID SaaS. Error: " + error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=issueCredentials.js.map