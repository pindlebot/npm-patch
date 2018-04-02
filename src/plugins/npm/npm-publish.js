// @flow
const execa = require('execa')
const logger = require('../../logger')
const NpmPatchError = require('../../npm-patch-error')

async function npmPublish (packageConfg: PackageConfig, argv: Array<string>):Promise<any> {
  const { packageJson, registry } = packageConfg
  let args = []
  args.push('publish')
  args.push('--registry')
  args.push(registry)
  args.push('--tag')
  args.push(argv.tag)
  if (argv['dry-run']) {
   return
  }
  try {
    const result = await execa('npm', args)
    result.stdout.split(/\r?\n/g)
      .forEach(line => logger.log('%s', line))
  } catch (err) {
    logger.error('Failed to publish %s@%s', packageJson.name, packageJson.version)
    throw new NpmPatchError('Failed to publish module', 'ENPMPUBLISH')
  }
}

module.exports = npmPublish
