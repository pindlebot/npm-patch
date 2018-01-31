const semver = require('semver')
const execa = require('execa')
const logger = require('./logger')

async function npmPatch(package, pubishedPackageInfo) {
  let { latest } = pubishedPackageInfo['dist-tags']
  const version = semver.inc(package.version, 'patch')

  if(semver.gt(package.version, latest)) {
    // don't bump version if current package.version > latest on registry
    logger.log('Published NPM package is behind current version %s', package.version)
  } else {
    try {
      await execa('npm', ['version', 'patch'])
      logger.log('Bumping version to %s', version)
    } catch(err) {
      
      logger.error(err)
      process.exit()
    }
  }
}

module.exports = npmPatch