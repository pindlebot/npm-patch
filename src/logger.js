
const chalk = require('chalk')

module.exports = {
  log (...args) {
    const [format, ...rest] = args
    console.log(
      `${chalk.grey('[npm-patch]:')}${
        typeof format === 'string' ? ` ${format.replace(/%[^%]/g, seq => chalk.magenta(seq))}` : ''
      }`,
      ...(typeof format === 'string' ? [] : [format]).concat(rest)
    )
  },
  error (...args) {
    const [format, ...rest] = args
    console.error(
      `${chalk.grey('[npm-patch]:')}${typeof format === 'string' ? ` ${chalk.red(format)}` : ''}`,
      ...(typeof format === 'string' ? [] : [format]).concat(rest)
    )
  }
}
