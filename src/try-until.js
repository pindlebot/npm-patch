// @flow

async function tryUntil (promises: Array<Function>, ...args: Array<any>) {
  const resolved = []

  while (promises.length) {
    try {
      let promise = await promises.shift()(...args)
      resolved.push(promise)
      continue
    } catch (err) {
      throw err
    }
  }

  return resolved
}

module.exports = tryUntil
