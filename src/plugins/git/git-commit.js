// @flow
const git = require('has-git')
const execa = require('execa')
const logger = require('../../logger')
const NpmPatchError = require('../../npm-patch-error')
const chalk = require('chalk')

async function gitCommit (packageConfig: PackageConfig, argv: Array<string>) {
  if (!await git.hasGit()) return

  if (await git.isDirty()) {
    logger.log('Branch is dirty.')
    let untracked = await git.listUntracked()
    untracked.forEach(file => {
      console.log(
        `${chalk.grey('[npm-patch]:')} ${chalk.green(file)} ${chalk.grey('(untracked)')}`
      )
    })
    try {
      let out = await execa('git', ['commit', '-am', ':pencil2: patch'])
      logger.log('Changes: %s', out.stdout.split(/\r?\n/g)[1].trim())
      return
    } catch (err) {
      throw new NpmPatchError('Failed to commit changes', 'EGITCOMMIT')
    }
  }

  if (
    packageConfig.packageJson.npmPatch &&
    packageConfig.packageJson.npmPatch.skipClean
  ) {
    throw new NpmPatchError('No changes to publish', 'EGITCOMMIT')
  }
}

module.exports = gitCommit
