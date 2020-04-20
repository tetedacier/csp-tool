const t = require('tap')
const { getStringFingerPrint } = require('../src')
const {
  stringFingerPrint: {
    input,
    output
  }
} = require('../fixtures/expectations')

t.test('getStringFingerPrint method', (t) => {
  t.equal(
    getStringFingerPrint(input),
    output
  )
  t.end()
})
