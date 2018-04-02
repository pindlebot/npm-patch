// @flow

const fetch = require('node-fetch')

async function npmName (packageConfig: PackageConfig): Promise<T> {
  const { registry } = packageConfig.publishConfig
  try {
    await fetch(registry + packageConfig.name)
  } catch (err) {
    if (err.statusCode === 404) return false
  }
  return true
}

module.exports = npmName
