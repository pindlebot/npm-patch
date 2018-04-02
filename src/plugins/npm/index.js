// @flow
const npmPatch = require('./npm-patch')
const verifyAuth = require('./verify-auth')
const npmPublish = require('./npm-publish')
const tryUntil = require('../../try-until')

async function Npm (packageConfig: PackageConfig, argv: Array<string>) {
  try {
    await tryUntil([
      npmPatch,
      verifyAuth,
      npmPublish
    ],
      packageConfig, argv
    )
  } catch (err) {
    throw err
  }
}

module.exports = Npm
