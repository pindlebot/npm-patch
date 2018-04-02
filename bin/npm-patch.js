#!/usr/bin/env node

const argv = require('yargs')
  .option('canary')
  .option('cwd', {
    type: 'string'
  })
  .option('access', {
    type: 'string',
    default: 'public',
    options: ['public', 'restricted']
  })
  .option('tag', {
    type: 'string',
    default: 'latest'
  })
  .option('dry-run', {
    type: 'boolean',
    default: false
  })
  .command('$0', 'publish to npm', () => {}, async argv => {
    require('../lib')(argv)
  }).argv
