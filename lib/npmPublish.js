const execa = require('execa')
const flatten = require('lodash.flatten')
const logger = require('./logger')

async function npmPublish(package, argv) {
  let { name, version, publishConfig: { registry } } = package;
  
  try {
    await execa('npm', ['publish', '--registry', registry, ...argv])
      .then(result => {
        logger.log('Published %s to registry %s', result.stdout, registry)
      })
  } catch(err) {
    logger.error('Failed to publish %s@%s', name, version)
  }
  return
}

module.exports = npmPublish