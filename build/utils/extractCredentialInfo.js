"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCredentialInfo = void 0;
var helpers_1 = require("./helpers");
/**
 * Handler to extract credential reporting information meant to be relied to UnumID's SaaS for the enhanced analytics dashboard.
 * @param presentation // a post decrypted and verified presentation object;
 */
exports.extractCredentialInfo = function (presentation) {
    var credentialTypes = [];
    if (presentation.verifiableCredential && helpers_1.isArrayNotEmpty(presentation.verifiableCredential)) { // Don't really need to check for existence because does so in isArrayNotEmpty() but doing so just to appease typescript
        // cut off the preceding 'VerifiableCredential' string in each credential type array
        credentialTypes = presentation.verifiableCredential.flatMap(function (cred) { return helpers_1.isArrayNotEmpty(cred.type) && cred.type[0] === 'VerifiableCredential' ? cred.type.slice(1) : cred.type; });
    }
    // need to handle the possibility of a did fragment being part of the verification method.
    var subjectDid = presentation.proof.verificationMethod.split('#')[0];
    return {
        credentialTypes: credentialTypes,
        subjectDid: subjectDid
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdENyZWRlbnRpYWxJbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2V4dHJhY3RDcmVkZW50aWFsSW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxxQ0FBNEM7QUFHNUM7OztHQUdHO0FBQ1UsUUFBQSxxQkFBcUIsR0FBRyxVQUFDLFlBQTJDO0lBQy9FLElBQUksZUFBZSxHQUFhLEVBQUUsQ0FBQztJQUVuQyxJQUFJLFlBQVksQ0FBQyxvQkFBb0IsSUFBSSx5QkFBZSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLEVBQUUsd0hBQXdIO1FBQ3JOLG9GQUFvRjtRQUNwRixlQUFlLEdBQUksWUFBWSxDQUFDLG9CQUFxQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLHlCQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUF0RyxDQUFzRyxDQUFDLENBQUM7S0FDL0w7SUFFRCwwRkFBMEY7SUFDMUYsSUFBTSxVQUFVLEdBQUksWUFBWSxDQUFDLEtBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEYsT0FBTztRQUNMLGVBQWUsaUJBQUE7UUFDZixVQUFVLFlBQUE7S0FDWCxDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBDcmVkZW50aWFsSW5mbyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFByZXNlbnRhdGlvbiwgUHJlc2VudGF0aW9uUGIsIENyZWRlbnRpYWwgfSBmcm9tICdAdW51bWlkL3R5cGVzJztcbmltcG9ydCB7IGlzQXJyYXlOb3RFbXB0eSB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyBQcm9vZiB9IGZyb20gJ0B1bnVtaWQvdHlwZXMvYnVpbGQvcHJvdG9zL3Byb29mJztcblxuLyoqXG4gKiBIYW5kbGVyIHRvIGV4dHJhY3QgY3JlZGVudGlhbCByZXBvcnRpbmcgaW5mb3JtYXRpb24gbWVhbnQgdG8gYmUgcmVsaWVkIHRvIFVudW1JRCdzIFNhYVMgZm9yIHRoZSBlbmhhbmNlZCBhbmFseXRpY3MgZGFzaGJvYXJkLlxuICogQHBhcmFtIHByZXNlbnRhdGlvbiAvLyBhIHBvc3QgZGVjcnlwdGVkIGFuZCB2ZXJpZmllZCBwcmVzZW50YXRpb24gb2JqZWN0O1xuICovXG5leHBvcnQgY29uc3QgZXh0cmFjdENyZWRlbnRpYWxJbmZvID0gKHByZXNlbnRhdGlvbjogUHJlc2VudGF0aW9uIHwgUHJlc2VudGF0aW9uUGIpOiBDcmVkZW50aWFsSW5mbyA9PiB7XG4gIGxldCBjcmVkZW50aWFsVHlwZXM6IHN0cmluZ1tdID0gW107XG5cbiAgaWYgKHByZXNlbnRhdGlvbi52ZXJpZmlhYmxlQ3JlZGVudGlhbCAmJiBpc0FycmF5Tm90RW1wdHkocHJlc2VudGF0aW9uLnZlcmlmaWFibGVDcmVkZW50aWFsKSkgeyAvLyBEb24ndCByZWFsbHkgbmVlZCB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGJlY2F1c2UgZG9lcyBzbyBpbiBpc0FycmF5Tm90RW1wdHkoKSBidXQgZG9pbmcgc28ganVzdCB0byBhcHBlYXNlIHR5cGVzY3JpcHRcbiAgICAvLyBjdXQgb2ZmIHRoZSBwcmVjZWRpbmcgJ1ZlcmlmaWFibGVDcmVkZW50aWFsJyBzdHJpbmcgaW4gZWFjaCBjcmVkZW50aWFsIHR5cGUgYXJyYXlcbiAgICBjcmVkZW50aWFsVHlwZXMgPSAocHJlc2VudGF0aW9uLnZlcmlmaWFibGVDcmVkZW50aWFsIGFzIENyZWRlbnRpYWxbXSkuZmxhdE1hcChjcmVkID0+IGlzQXJyYXlOb3RFbXB0eShjcmVkLnR5cGUpICYmIGNyZWQudHlwZVswXSA9PT0gJ1ZlcmlmaWFibGVDcmVkZW50aWFsJyA/IGNyZWQudHlwZS5zbGljZSgxKSA6IGNyZWQudHlwZSk7XG4gIH1cblxuICAvLyBuZWVkIHRvIGhhbmRsZSB0aGUgcG9zc2liaWxpdHkgb2YgYSBkaWQgZnJhZ21lbnQgYmVpbmcgcGFydCBvZiB0aGUgdmVyaWZpY2F0aW9uIG1ldGhvZC5cbiAgY29uc3Qgc3ViamVjdERpZCA9IChwcmVzZW50YXRpb24ucHJvb2YgYXMgUHJvb2YpLnZlcmlmaWNhdGlvbk1ldGhvZC5zcGxpdCgnIycpWzBdO1xuXG4gIHJldHVybiB7XG4gICAgY3JlZGVudGlhbFR5cGVzLFxuICAgIHN1YmplY3REaWRcbiAgfTtcbn07XG4iXX0=