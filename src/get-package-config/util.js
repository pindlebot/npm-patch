// @flow
const set = require('lodash.set')
const { readJson, writeJson } = require('fs-extra')
const fetch = require('node-fetch')
const logger = require('../logger')

const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org/'

async function getPackageJson (packageJsonPath: PackageJsonPath): Promise<PackageJson | any> {
  try {
    const packageJson = readJson(packageJsonPath)
    return packageJson
  } catch (err) {
    logger.error('Could not find package.json at path %s', packageJsonPath)
    return undefined
  }
}

async function updatePackageJson (
  packageJsonPath,
  packageJson,
  registry : string = DEFAULT_NPM_REGISTRY
): Promise<PackageJson> {
  packageJson = set(packageJson, 'publishConfig.registry', registry)

  try {
    logger.log('Adding registry %s to package.json', registry)
    await writeJson(packageJsonPath, packageJson, { spaces: 2 })
    return packageJson
  } catch (err) {
    logger.log(err)
  }
}

function getPackageInfo (packageJson: PackageJson, registry: Registry) {
  const url = registry + packageJson.name
  logger.log('Fetching package info from %s', url)
  return fetch(url)
    .then(resp => resp.json())
    .then(resp =>
      resp && Object.keys(resp).length
        ? resp : (function () { throw new Error() })()
    )
}

const util = {
  getPackageJson,
  updatePackageJson,
  getPackageInfo
}

module.exports = util
