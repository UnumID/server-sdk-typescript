import { Request, Response, NextFunction } from 'express';
import {
  CustError,
  getKeyFromDIDDoc,
  doVerify,
  getDIDDoc,
  makeNetworkRequest,
  RESTData
} from 'library-issuer-verifier-utility';
import { omit } from 'lodash';

import { NoPresentation } from './types';
import { validateProof } from './validateProof';
import { configData } from './config';
import { requireAuth } from './requireAuth';

/**
 * Validates the NoPresentation type to ensure the necessary attributes.
 * @param noPresentation NoPresentation
 */
export const validateNoPresentationParams = (noPresentation: NoPresentation): void => {
  const {
    type,
    holder,
    proof,
    presentationRequestUuid
  } = noPresentation;

  if (!type) {
    throw new CustError(400, 'type is required.');
  }

  if (!proof) {
    throw new CustError(400, 'proof is required.');
  }

  if (!holder) {
    throw new CustError(400, 'holder is required.');
  }

  if (!presentationRequestUuid) {
    throw new CustError(400, 'presentationRequestUuid is required.');
  }

  if (type[0] !== 'NoPresentation') {
    throw new CustError(400, 'Invalid type: first element must be \'NoPresentation\'.');
  }

  if (typeof holder !== 'string') {
    throw new CustError(400, 'Invalid holder: must be a string.');
  }

  if (typeof presentationRequestUuid !== 'string') {
    throw new CustError(400, 'Invalid presentationRequestUuid: must be a string.');
  }

  validateProof(proof);
};

/**
 * Request middleware to handle a user not agreeing to share the information in the credential request.
 *
 * Note: The request body is exaclty the information sent by the mobile SDK serving the prompt via the deeplink for credential sharing to your application.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const verifyNoPresentation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { noPresentation, verifier } = req.body;

    const { authorization } = req.headers;

    requireAuth(authorization);

    validateNoPresentationParams(noPresentation);

    const { proof: { verificationMethod, signatureValue } } = noPresentation;

    const didDocumentResponse = await getDIDDoc(configData.SaaSUrl, authorization as string, verificationMethod);

    if (didDocumentResponse instanceof Error) {
      throw didDocumentResponse;
    }

    const publicKeyInfos = getKeyFromDIDDoc(didDocumentResponse.body, 'secp256r1');

    const { publicKey, encoding } = publicKeyInfos[0];

    const unsignedNoPresentation = omit(noPresentation, 'proof');

    const isVerified = doVerify(signatureValue, unsignedNoPresentation, publicKey, encoding);

    const receiptOptions = {
      type: noPresentation.type,
      verifier,
      subject: noPresentation.holder,
      data: {
        isVerified
      }
    };

    const receiptCallOptions: RESTData = {
      method: 'POST',
      baseUrl: configData.SaaSUrl,
      endPoint: 'receipt',
      header: { Authorization: authorization },
      data: receiptOptions
    };

    await makeNetworkRequest(receiptCallOptions);

    const authToken = didDocumentResponse.headers['x-auth-token'];

    if (authToken) {
      res.setHeader('x-auth-token', didDocumentResponse.headers['x-auth-token']);
    }
    res.send({ isVerified });
  } catch (e) {
    next(e);
  }
};
