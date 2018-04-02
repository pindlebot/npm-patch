// @flow
const semver = require('semver')
const { writeJson } = require('fs-extra')
const path = require('path')
const set = require('lodash.set')
const logger = require('../../logger')
const NpmPatchError = require('../../npm-patch-error')
const git = require('has-git')

async function bumpVersion (packageConfig, argv) {
  const tagArg = argv.tag
  const { packageJson, publishedPackageInfo } = packageConfig
  const publishedVersions = publishedPackageInfo['dist-tags']
  const currentVersion = publishedVersions[tagArg] || publishedVersions.latest
  const release = argv.tag === 'latest'
    ? 'patch'
    : 'prerelease'
  let { raw } = semver.coerce(currentVersion)
  let components = semver.prerelease(currentVersion)
  if (typeof argv.canary !== 'undefined') {
    let gitSHA = await git.getShortSHA(packageConfig.appRoot)
    let prerelease = components
      ? (components.find(c => /^\d+$/m.test(c)) || '0')
      : '0'
    let nextTag = argv.canary.length ? argv.canary : tagArg
    let newComponents = [
      nextTag,
      prerelease,
      gitSHA
    ]
    let next = semver.gte(publishedVersions.latest, currentVersion)
      ? semver.inc(raw, 'patch', 'latest')
      : raw
    return `${next}-${newComponents.join('.')}`
  }
  
  let version = components && components.length
    ? `${raw}-${components.slice(2).join('.')}`
    : raw
  return semver.inc(version, release, tagArg)
}

async function npmPatch (packageConfig: PackageConfig, argv: Array<string>):Promise<any> {
  const { packageJson, publishedPackageInfo } = packageConfig
  if (!publishedPackageInfo) return
  let newVersion = await bumpVersion(packageConfig, argv)
  try {
    await writeJson(
      path.join(packageConfig.appRoot, 'package.json'),
      set(packageJson, 'version', newVersion),
      { spaces: 2 }
    )
    logger.log('Bumped version to %s', newVersion)
  } catch (err) {
    logger.error('Failed to bump version to %s', newVersion)
    throw new NpmPatchError('Failed to bump version', 'ENPMPATCH')
  }

  return newVersion
}

module.exports = npmPatch
