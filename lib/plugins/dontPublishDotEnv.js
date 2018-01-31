const { pathExists, readFile } = require('fs-extra')
const { getPath } = require('../package')
const logger = require('../logger')

const error = () => logger.error('.env is not added to .npmignore')    

async function dontPublishDotEnv() {
  let hasDotEnv = await pathExists(getPath('.env'))
  if(!hasDotEnv) return true;
  
  let hasNpmIgnore = await pathExists(getPath('.npmignore'))
  let hasGitIgnore = await pathExists(getPath('.gitignore'))

  if(!hasNpmIgnore && !hasGitIgnore) {
    error()
    return false
  }
  
  let ignore = await readFile(hasNpmIgnore ? getPath('.npmignore') : getPath('.gitignore')
    , { encoding: 'utf8' })    
  
  let isOk = !!ignore
    .split('\n')
    .find(line => /\.env/.test(line))
  
  if(!isOk) {
    error()
  }

  return isOk
}

module.exports = dontPublishDotEnv