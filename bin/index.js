const dirname = process.argv[2];
const {
    getFilesFingerPrint
} = require('../src')

if (dirname) {
    getFilesFingerPrint(dirname)
}