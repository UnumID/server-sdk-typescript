import { UnumDto, VerifiedStatus } from '../types';
import { SubjectCredentialRequests } from '@unumid/types';
/**
 * Verify the CredentialRequests signatures.
 */
export declare function verifySubjectCredentialRequests(authorization: string, issuerDid: string, subjectDid: string, credentialRequests: SubjectCredentialRequests): Promise<UnumDto<VerifiedStatus>>;
export declare function verifySubjectCredentialRequestsHelper(authToken: string, issuerDid: string, subjectCredentialRequests: SubjectCredentialRequests): Promise<UnumDto<VerifiedStatus>>;
//# sourceMappingURL=verifySubjectCredentialRequests.d.ts.map