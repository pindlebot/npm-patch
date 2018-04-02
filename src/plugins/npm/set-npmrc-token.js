// @flow
const { appendFile } = require('fs-extra')
const nerfDart = require('nerf-dart')
const getAuthToken = require('registry-auth-token')
const logger = require('../../logger')
const NpmPatchError = require('../../npm-patch-error')

async function setNpmrcToken (registry):Promise<any> {
  let token = getAuthToken(registry)
  if (token) return

  const {
    NPM_TOKEN,
    NPM_USERNAME,
    NPM_PASSWORD,
    NPM_EMAIL
  } = process.env

  if (NPM_USERNAME && NPM_PASSWORD && NPM_EMAIL) {
    await appendFile('./.npmrc', `\n_auth = ${Buffer.from(`\${LEGACY_TOKEN}\nemail = \${NPM_EMAIL}`)}`)
    logger.log('Wrote NPM_USERNAME, NPM_PASSWORD and NPM_EMAIL to .npmrc.')
  } else if (NPM_TOKEN) {
    await appendFile('./.npmrc', `\n${nerfDart(registry)}:_authToken = \${NPM_TOKEN}`)
    logger.log('Wrote NPM_TOKEN to .npmrc.')
  } else {
    throw new NpmPatchError('NPM_TOKEN is required', 'ESETNPMRCTOKEN')
  }
}

module.exports = setNpmrcToken
