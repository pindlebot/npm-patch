// @flow

class NpmPatchError extends Error {
  constructor (message: string, code: string) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'NpmPatchError'
    this.code = code
    this.npmPatch = true
  }
};

module.exports = NpmPatchError
