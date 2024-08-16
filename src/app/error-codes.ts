// error-codes.ts
/**
 * Enum for error codes.
 */
export enum ErrorCodes {
  /**
   * Error code indicating that a user with the same credentials already exists.
   * Example: When a user tries to sign up with an email address that is already in use.
   */
  UserExists = 304,

  /**
   * Error code indicating that the user is on a blocklist and cannot perform the requested action.
   * Example: When a user who has been banned tries to log in.
   */
  OnBlocklist = 406,
}