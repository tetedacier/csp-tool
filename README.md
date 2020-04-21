# csp-tool
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
Content security policy management tool

## Goal
Simplify "Content-Security-Policy" header generation.

## How to use

### Install
As for any npm module, you can install it as a dependency of your project through

```sh
npm i csp-tool # or yarn `
```

or globally using:

```sh
npm i -g csp-tool # or yarn
```

### CLI
This packackage exibit a cli tool to generate a json file which list *every* child files of a given directory.
To use it with the default cipher (`sha256`), in your terminal id you install it globally:

```sh
csp-tool <your-assets-folder-here>
```

or if you install it as a dependencies of your project:

```sh
./node_modules/.bin/csp-tool <your-assets-folder-here>
```

which should ouput a json formated like this :

```json
{
    "<file-name-relative-to-your-assets-folder>": "<cipher-used>-<hash-of-the-file-according-to-the-cipher-user>",
    ...
}
```

If you want to use a different cipher provide it using the `CSP_HASH_ALGORITHM` environnement variable :

```sh
CSP_HASH_ALGORITHM=sha512 csp-tool <your-assets-folder-here>
```

3 hash's algorithm are actually possible:
- `sha256`
- `sha384`
- `sha512`

### API
There's actually two method exported by this package. I would provide their detailled signature here in future version.

By the way it should provides you hints on how to use it in [`Microsoft Visual Studio Code ®`](https://code.visualstudio.com/) thanks to [`JSDoc`](https://jsdoc.app/).

As far as I know it shoud also provide the same kind of hints in [WebStorm](https://www.jetbrains.com/fr-fr/webstorm).

Let me know if something is not working for you through the [project issues](https://github.com/tetedacier/csp-tool/issues) 

### getFilesFingerPrint(dirname, algorithm)
### getStringFingerPrint(sourceString, algorithm)

## Work in progress
### JSDoc integration
All the API will be documented in version `0.4.0`

### Contribution guideline
This will be handled in `1.0.0` version. By the way, don't be rude ;)

## References

I based my work on the following document, repository and article, freely accessible on the internet:
- https://scotthelme.co.uk/content-security-policy-an-introduction/
- https://developers.google.com/web/fundamentals/security/csp
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
- https://developer.mozilla.org/fr/docs/Web/HTTP/CSP 
- https://xo.tc/calculating-a-base64-encoded-sha256-sum-of-inline-scripts-for-your-content-security-policy.html
- https://www.w3.org/TR/CSP2/#script-src-hash-usage
- https://git.coolaj86.com/coolaj86/btoa.js
 