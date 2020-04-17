const crypto = require('crypto');
const hash_algorithm = process.env.CSP_HASH_ALGORITHM || 'sha256'
const { readdir, createReadStream } = require('fs');

const readableFileStream = ({ hash, dir, filename, resolve, input, algorithm } = {}) => () => {
    const data = input.read();
    if (data)
        hash.update(data);
    else {
        return resolve({
            hash: `${algorithm}-${hash.digest().toString('base64')}`,
            filename: `${dir}/${filename}`
        });
    }
}

const erroredFileStream = ({ dir, filename, resolve, algorithm } = {}) =>
    (error) => (error.code === 'EISDIR')
        ? listClientChar(`${dir}/${filename}`, algorithm)
            .then((listing) => resolve(listing))
            .catch((error) => resolve({
                error,
                filename: `${dir}/${filename}`
            }))
        : resolve({
            error,
            filename: `${dir}/${filename}`
        })

const walkPromise = ({ filename, algorithm, dir } = {}) => new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const input = createReadStream(`${dir}/${filename}`);
    input.on('readable', readableFileStream({ hash, dir, filename, resolve, input, algorithm }));
    input.on('error', erroredFileStream({ dir, filename, resolve, algorithm }))
})

const walkThroughDir = ({ dir, algorithm, listResolve, listReject, files } = {  }) => {
    Promise.all(files.map((filename) => walkPromise({ filename, algorithm, dir, filename })))
        .then((result) => listResolve(result))
        .catch((error) => listReject(error))
}

const listClientChar = (dir, algorithm) => new Promise((listResolve, listReject) => {
    readdir(dir, (error, files) => {
        if(error)  {
            throw error;
        }
        walkThroughDir({ dir, algorithm, listResolve, listReject, files })
    })
})


const getEffectiveAlgorithm = (algorithm) => algorithm || hash_algorithm

/**
 * @method getFilesFingerPrint
 * @description Walk through given root path and produce a fingerprint using provided or default algotrithm.
 * Default algorithm is `sha256`, it can be modified using `CSP_HASH_ALGORITHM` environment variable. Accepted values are:
 *  - `sha256` 
 *  - `sha384` 
 *  - `sha512` 
 * @param {String} dirname Root path to search files
 * @param {String='sha256', 'sha384', 'sha512'} algorihm Algorithm used to compute files fingerprint. 
 */
module.exports.getFilesFingerPrint = (dirname, algorithm) => {
    listClientChar(dirname, getEffectiveAlgorithm(algorithm))
        .then((result) => console.log(
            result.flat(1).reduce( // this should be challenged through a depth report
                (acc, item) => Object.assign({
                    [item.filename.substr(dirname.length+1)]: item.hash
                }, acc),
                {}
            )
        ))
        .catch((error) => console.error(error))
}

/**
 * @method getStringFingerPrint
 * @description Compute the fingerprint associated with a given string using provided or default algotrithm.
 * Default algorithm is `sha256`, it can be modified using `CSP_HASH_ALGORITHM` environment variable. Accepted values are:
 *  - `sha256` 
 *  - `sha384` 
 *  - `sha512` 
 * @param {String} sourceString String representing the resource
 * @param {String='sha256', 'sha384', 'sha512'} algorihm  Algorithm used to compute files fingerprint. 
 * @returns {String} The computed csp fingerprint
 */
module.exports.getStringFingerPrint = (sourceString, algorithm) => {
    const usedAlgorithm = getEffectiveAlgorithm(algorithm)
    const hash = crypto.createHash(usedAlgorithm)
    hash.update(sourceString)
    return `${usedAlgorithm}-${hash.digest().toString('base64')}`
}