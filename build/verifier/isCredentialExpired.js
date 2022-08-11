"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCredentialExpired = void 0;
/**
 * Helper to assess the expiration status of a credential.
 * @param credential VerifiableCredential
 */
exports.isCredentialExpired = function (credential) {
    var expirationDate = credential.expirationDate;
    if (!expirationDate) {
        return false;
    }
    return new Date(expirationDate).getTime() < new Date().getTime();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNDcmVkZW50aWFsRXhwaXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92ZXJpZmllci9pc0NyZWRlbnRpYWxFeHBpcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBOzs7R0FHRztBQUNVLFFBQUEsbUJBQW1CLEdBQUcsVUFBQyxVQUFxQztJQUMvRCxJQUFBLGNBQWMsR0FBSyxVQUFVLGVBQWYsQ0FBZ0I7SUFFdEMsSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUNuQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25FLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENyZWRlbnRpYWwsIENyZWRlbnRpYWxQYiB9IGZyb20gJ0B1bnVtaWQvdHlwZXMnO1xuXG4vKipcbiAqIEhlbHBlciB0byBhc3Nlc3MgdGhlIGV4cGlyYXRpb24gc3RhdHVzIG9mIGEgY3JlZGVudGlhbC5cbiAqIEBwYXJhbSBjcmVkZW50aWFsIFZlcmlmaWFibGVDcmVkZW50aWFsXG4gKi9cbmV4cG9ydCBjb25zdCBpc0NyZWRlbnRpYWxFeHBpcmVkID0gKGNyZWRlbnRpYWw6IENyZWRlbnRpYWwgfCBDcmVkZW50aWFsUGIpOiBib29sZWFuID0+IHtcbiAgY29uc3QgeyBleHBpcmF0aW9uRGF0ZSB9ID0gY3JlZGVudGlhbDtcblxuICBpZiAoIWV4cGlyYXRpb25EYXRlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBEYXRlKGV4cGlyYXRpb25EYXRlKS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn07XG4iXX0=