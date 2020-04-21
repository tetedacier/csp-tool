const t = require('tap')
const child = require('child_process')
const {
  sha256: sha256Expectation,
  zalgoError,
  noFolderError
} = require('../fixtures/expectations')
t.test('CLI must produces hashes using `sha256` algorithm', (t) => {
  const proc = child.spawn('bin/index.js', ['fixtures/fs'])
  let output = ''

  proc.stdout.on('data', data => {
    output += data
  })

  proc.stdout.on('end', () => {
    const result = JSON.parse(output)

    t.test('return an object with the same key arrity as the expected one', (t) => {
      t.equal(Object.keys(result).length, Object.keys(sha256Expectation).length)
      t.end()
    })

    t.test('return an object where each keys are equas to the expected one', (t) => {
      Object.keys(sha256Expectation).forEach(
        key => t.equal(result[key], sha256Expectation[key])
      )
      t.end()
    })

    t.end()
  })
})

t.test('CLI must produce an algorithm error if provided a wrong one', (t) => {
  const proc = child.spawn('bin/index.js', ['fixtures/fs'], {env: {
    CSP_HASH_ALGORITHM: 'zalgo'
  }})
  let output = ''

  proc.stderr.on('data', data => {
    output += data
  })

  proc.on('exit', () => {
    t.equal(output.split('\n')[0], zalgoError)
    t.end()
  })
})

t.test('CLI must produce an error message when no folder is provided', (t) => {
  const proc = child.spawn('bin/index.js', [])
  let output = ''

  proc.stderr.on('data', data => {
    output += data
  })

  proc.on('exit', () => {
    t.equal(output.split('\n')[0], noFolderError)
    t.end()
  })
})
