const { appendFile } = require('fs-extra')
const nerfDart = require('nerf-dart')
const getAuthToken = require('registry-auth-token')
const os = require('os')
const logger = require('./logger')

async function setNpmrcToken(registry) {
  let token = getAuthToken(registry)
  if(token) return

  const {
    NPM_TOKEN, 
    NPM_USERNAME, 
    NPM_PASSWORD, 
    NPM_EMAIL
  } = process.env;
  
  if (NPM_USERNAME && NPM_PASSWORD && NPM_EMAIL) {
    await appendFile('./.npmrc', `\n_auth = ${Buffer.from(`\${LEGACY_TOKEN}\nemail = \${NPM_EMAIL}`)}`);
    logger.log('Wrote NPM_USERNAME, NPM_PASSWORD and NPM_EMAIL to .npmrc.');
  } else if(NPM_TOKEN) {
    await appendFile('./.npmrc', `\n${nerfDart(registry)}:_authToken = \${NPM_TOKEN}`);
    logger.log('Wrote NPM_TOKEN to .npmrc.');
  } else {
    logger.error('NPM_TOKEN is required')
    process.exit()
  }

  return
}

module.exports = setNpmrcToken
