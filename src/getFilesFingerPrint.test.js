const t = require('tap')
const { symlinkSync, unlinkSync } = require('fs')
const { getFilesFingerPrint } = require('../src')
const {
  sha256: sha256Expectation,
  zalgoError
} = require('../fixtures/expectations')

t.test(
  'getFilesFingerPrint method executed on fixtures folder',
  (t) => getFilesFingerPrint('./fixtures/fs').then(result => {
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
  })
)

t.test(
  'getFilesFingerPrint method fails when called with an invalid algorithm',
  (t) => getFilesFingerPrint('./fixtures/fs', 'zalgo').catch(error => {
    t.equal(error.toString(), zalgoError)
    t.end()
  })
)

t.test(
  'getFilesFingerPrint method reject when provided a non existing folder',
  (t) => getFilesFingerPrint('./fixtures/t').catch(error => {
    t.equal(error.code, 'ENOENT')
    t.end()
  })
)
console.warn(__dirname)
t.test(
  'getFilesFingerPrint method reject when walking in a dead symlink',
  (t) => {
    // this is just a broken link generation to test behavior of the tool in this case
    symlinkSync('fixtures/broken-fs/folder-1/folder-2/file-1.css', './fixtures/broken-fs/folder-1/bad.css')

    getFilesFingerPrint('./fixtures/broken-fs').catch(error => {
      t.equal(error.code, 'ENOENT')
      t.equal(error.path, './fixtures/broken-fs/folder-1/bad.css')

      // cleanup broken fs
      unlinkSync('./fixtures/broken-fs/folder-1/bad.css')

      t.end()
    })
  }
)
