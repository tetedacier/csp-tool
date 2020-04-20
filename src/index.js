const crypto = require('crypto');
const hash_algorithm = process.env.CSP_HASH_ALGORITHM || 'sha256'
const { readdir, createReadStream } = require('fs');
const allowedAlgorithm = Object.freeze(['sha256', 'sha384', 'sha512']);

const getEffectiveAlgorithm = (algorithm) => algorithm || hash_algorithm

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

/**
 * @method getFilesFingerPrint
 * @description Walk through given root path and produce a fingerprint for each files recursively using provided or default algotrithm.
 * Default algorithm is `sha256`, it can be modified using `CSP_HASH_ALGORITHM` environment variable. Accepted values are:
 *  - `sha256` 
 *  - `sha384` 
 *  - `sha512` 
 * @param {String} dirname Root path to search files
 * @param {String='sha256', 'sha384', 'sha512'} algorihm Algorithm used to compute files fingerprint. 
 * @returns {Promise} Promise object represents an object with relative path of files discovered as keys and their computed fingerprint
 * according to the resolved algorithm
 */
module.exports.getFilesFingerPrint = (dirname, algorithm) => new Promise((resolve, reject) => {
    listClientChar(dirname, getEffectiveAlgorithm(algorithm))
        .then((result) => resolve(
            /* flattening depth must be derived from effectively discovered depth */
            result.flat(2).reduce(
                (acc, item) => Object.assign({
                    [item.filename.substr(dirname.length+1)]: item.hash
                }, acc),
                {}
            )
        ))
        .catch((error) => reject(error))
})

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