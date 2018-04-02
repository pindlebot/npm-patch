// @flow
const execa = require('execa')
const normalizeUrl = require('normalize-url')
const setNpmrcToken = require('./set-npmrc-token')

const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org/'

async function verifyAuth (packageConfig: PackageConfig, argv: Array<string>) {
  const { registry } = packageConfig
  await setNpmrcToken(registry)
  const defaultRegistry = process.env.DEFAULT_NPM_REGISTRY || DEFAULT_NPM_REGISTRY

  if (normalizeUrl(registry) === normalizeUrl(defaultRegistry)) {
    try {
      await execa('npm', ['whoami', '--registry', registry])
    } catch (err) {
      throw new Error('Invalid npm token.')
    }
  }
};

module.exports = verifyAuth
