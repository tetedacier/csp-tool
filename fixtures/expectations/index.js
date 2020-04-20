module.exports = {
  sha256: {
    'subfolder/subsubfolder/a.png': 'sha256-UsCeFZgF8JGsvAJ6Rdi/T1jRh5Yivv2MKhU+vRsBVlg=',
    'subfolder/a.css': 'sha256-WxSFMgSzxcznhC/Go8vPE4iV9WxKl5vXjDrcshjiqoQ=',
    'a.js': 'sha256-7Sg2OudLH+fRuNT0I4GWEadiNXe119hWkxqZR/W9DzQ='
  },
  stringFingerPrint: {
    input: 'test',
    output: 'sha256-n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='
  },
  zalgoError: "RangeError: provided algorithm zalgo did not match Content-Security-Policy header's allowed algorithm (one of `sha256`,`sha384`,`sha512`)"
}
