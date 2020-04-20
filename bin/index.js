#!/usr/bin/env node

const dirname = process.argv[2]
const {
    getFilesFingerPrint
} = require('../src')

if (dirname) {
    getFilesFingerPrint(dirname)
        .then(result => console.log(result))
        .catch(error => {
            console.error(error)
            process.exit(1)
        })
}
