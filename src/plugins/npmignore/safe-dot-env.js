// @flow
const { pathExists, readFile } = require('fs-extra')
const path = require('path')
const NpmPatchError = require('../../npm-patch-error')

async function safeDotEnv (packageConfig: PackageConfig, argv: Array<string>) {
  const { appRoot } = packageConfig
  const npmIgnorePath = path.join(appRoot, '.npmignore')
  const gitIgnorePath = path.join(appRoot, '.gitignore')

  let hasDotEnv = await pathExists(path.join(appRoot, '.env'))
  if (!hasDotEnv) return

  let hasNpmIgnore = await pathExists(npmIgnorePath)
  let hasGitIgnore = await pathExists(gitIgnorePath)

  if (!hasNpmIgnore && !hasGitIgnore) {
    throw new NpmPatchError('Either an .npmignore or .gitignore is required', 'EDOTENV')
  }

  let ignore = await readFile(
    hasNpmIgnore ? npmIgnorePath : gitIgnorePath,
    { encoding: 'utf8' }
  )

  let isOk = !!ignore
    .split('\n')
    .find(line => /\.env/.test(line))

  if (!isOk) {
    throw new NpmPatchError('.env must be added to .npmignore or .gitignore', 'EDOTENV')
  }
}

module.exports = safeDotEnv
