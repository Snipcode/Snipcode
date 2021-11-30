export enum PasswordAlgorithms {
  RAW = "RAW",
  BCRYPT = "BCRYPT",
  ARGON2 = "ARGON2"
}

/**
 * Create a hash for a raw password.
 *
 * @param {string} rawPassword The raw password
 * @returns {string} The hashed password
 */
export const hashPassword = async (rawPassword: string): Promise<string> => {
  // TODO: implement
  return rawPassword
}

/**
 * Verify password against a hash.
 *
 * @param {string} hash The hash to verify against
 * @param {string} password The raw password to verify
 * @returns {boolean} Is the password correct?
 */
export const verifyPassword = async (hash: string, password: string): Promise<boolean> => {
  // TODO: implement
  return false
}
