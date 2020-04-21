module.exports = {
  sha256: {
    'subfolder/subsubfolder/a.png': 'sha256-UsCeFZgF8JGsvAJ6Rdi/T1jRh5Yivv2MKhU+vRsBVlg=',
    'subfolder/a.css': 'sha256-ajP2W2UlPYFnOr5qqIj72rQPf7f/XOe5L4YNXGoqYR4=',
    'a.js': 'sha256-hIEY++OsZGUOE8H0VN5iXv4L4jzEZEXtPn49yZFTmPA='
  },
  stringFingerPrint: {
    input: 'test',
    output: 'sha256-n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='
  },
  zalgoError: "RangeError: provided algorithm zalgo did not match Content-Security-Policy header's allowed algorithm (one of `sha256`,`sha384`,`sha512`)",
  noFolderError: 'You must provide an valid folder path to csp-tool'
}
