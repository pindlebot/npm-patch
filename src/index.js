// @flow
const path = require('path')
const getPackageConfig = require('./get-package-config')
const npmignore = require('./plugins/npmignore')
const npm = require('./plugins/npm')
const git = require('./plugins/git')
const PrettyError = require('pretty-error')
const pretty = new PrettyError()
const tryUntil = require('./try-until')

async function init (argv) {
  let packageConfig
  try {
    packageConfig = await getPackageConfig(argv)
  } catch (err) {
    pretty.render(err, true, true)
    process.exitCode = 1
  }

  if (!packageConfig) {
    return
  }
  const { appRoot } = packageConfig
  require('dotenv').config({ path: path.join(appRoot, '.env') })

  const plugins = [
    npmignore,
    git,
    npm
  ]
  try {
    await tryUntil(plugins, packageConfig, argv)
  } catch (err) {
    pretty.render(err, true, true)
  }
}

module.exports = init
