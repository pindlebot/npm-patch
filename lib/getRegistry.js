const getRegistryUrl = require('registry-auth-token/registry-url')

function getRegistry (package) {
  return package.publishConfig && package.publishConfig.registry ? 
    package.publishConfig.registry : getRegistryUrl(package.name.split('/')[0])
}

module.exports = getRegistry
