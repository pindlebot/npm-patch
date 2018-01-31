const appRoot = require('app-root-path')
const path = require('path')
const set = require('lodash.set')
const { readJson, writeJson, pathExists } = require('fs-extra')
const fetch = require('node-fetch')
const getRegistryUrl = require('registry-auth-token/registry-url')
const execa = require('execa');
const logger = require('./logger')

const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org/';

function getPath (...args) {
  args.unshift(appRoot.path)  
  return path.join(...args)
}

const packagePath = getPath('package.json')

const npmIgnorePath = getPath('.npmignore')

async function getPackage () {
  if(await pathExists(packagePath)) {
    return readJson(packagePath)
  } else {
    logger.error('Could not find package.json at path %s', packagePath)
  }
}

async function updatePackage (
  package,
  registry = DEFAULT_NPM_REGISTRY,
) {
  package = set(package, 'publishConfig.registry', registry)
  
  try {
    logger.log('Adding registry %s to package.json', registry)
    return writeJson(packagePath, package, { spaces: 2 })
  } catch (err) {
    logger.log(err)
  }
}

function packageInfo(package, registry) {
  let url = registry + package.name
  logger.log('Fetching package info from %s', url)
  return fetch(url)
    .then(resp => resp.json())
}

module.exports = {
  getPackage,
  updatePackage,
  packageInfo,
  getPath
}


