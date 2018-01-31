const execa = require('execa');
const normalizeUrl = require('normalize-url');
const setNpmrcToken = require('./setNpmrcToken');

const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org/';

async function verifyAuth (
  package,
  registry
) {
  await setNpmrcToken(registry)
  const defaultRegistry = process.env.DEFAULT_NPM_REGISTRY || DEFAULT_NPM_REGISTRY

  if (normalizeUrl(registry) === normalizeUrl(defaultRegistry)) {
    try {
      await execa('npm', ['whoami', '--registry', registry]);
    } catch (err) {
      throw new Error('Invalid npm token.')
    }
  }

  return
};

module.exports = verifyAuth