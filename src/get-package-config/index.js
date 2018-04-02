// @flow
const getRegistry = require('./get-registry')
const {
  getPackageJson,
  updatePackageJson,
  getPackageInfo
} = require('./util')
const logger = require('../logger')
const NpmPatchError = require('../npm-patch-error')
const path = require('path')
const pkgUp = require('pkg-up')

function getPackageJsonPath (cwd: string): Promise<PackageJsonPath> {
  return pkgUp(cwd)
}

async function getPackageConfig (argv: Array<string>): Promise<PackageConfig> {
  let cwd = process.cwd()

  if (argv.cwd) {
    cwd = path.join(cwd, argv.cwd)
  }

  let publishedPackageInfo
  const packageJsonPath = await getPackageJsonPath(cwd)

  if (!packageJsonPath) {
    throw new NpmPatchError('Could not find project root.', 'EGETPACKAGECONFIG')
  }

  const appRoot = path.parse(packageJsonPath).dir
  let packageJson = await getPackageJson(packageJsonPath)
  const registry = await getRegistry(packageJson)

  if (
    !(packageJson.publishConfig && packageJson.publishConfig.registry)
  ) {
    packageJson = await updatePackageJson(packageJsonPath, packageJson, registry)
  }

  try {
    publishedPackageInfo = await getPackageInfo(packageJson, registry)
  } catch (err) {
    logger.error('Package does not exist on registry %s', registry)
  }

  return {
    appRoot,
    registry,
    packageJson,
    publishedPackageInfo
  }
}

module.exports = getPackageConfig
