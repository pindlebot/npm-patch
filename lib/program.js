#!/usr/bin/env node
const appRoot = require('app-root-path')
const path = require('path')
require('dotenv').config({ path: path.join(appRoot.path, '.env') })

const execa = require('execa')
const semver = require('semver')
const {
  getPath,
  getPackage,
  updatePackage,
  packageInfo,
} = require('./package')
const verifyAuth = require('./verifyAuth')
const getRegistry = require('./getRegistry')
const npmPublish = require('./npmPublish')
const npmPatch = require('./npmPatch')
const dontPublishDotEnv = require('./plugins/dontPublishDotEnv')
const logger = require('./logger')

const argv = process.argv.slice(2)

async function verify(...plugins) {
  let tests = await Promise.all(
    plugins.map(plugin => plugin())
  )
  return tests.length === tests.filter(testResult => testResult).length
}

async function init() {
  let publishedPackageInfo;
  let package = await getPackage()
  let registry = await getRegistry(package)

  if(
    !(package.publishConfig && package.publishConfig.registry)
  ) {
    await updatePackage(package, registry)
  }

  try {
    publishedPackageInfo = await packageInfo(package, registry)    
  } catch(err) {
    logger.log('Package does not exist on registry %s', registry)
    process.exit()
  }
  
  npmPatch(package, publishedPackageInfo)

  await verifyAuth(package, registry)
  let isOk = await verify(dontPublishDotEnv)

  if(
   !isOk
  ) {
    process.exit()
  } else {
    package = await getPackage()
    await npmPublish(package, argv) 
  }
}

init()