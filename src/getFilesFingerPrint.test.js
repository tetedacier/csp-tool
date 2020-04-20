const t = require('tap')
const { getFilesFingerPrint } = require('../src')
const {
    sha256: sha256Expectation
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