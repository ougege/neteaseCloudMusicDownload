function a(a) {
  var d
  var e
  var b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var c = ""
  for (d = 0; a > d; d += 1)
    e = Math.random() * b.length
    e = Math.floor(e)
    c += b.charAt(e)
  return c
}
function b(a, b) {
  var c = CryptoJS.enc.Utf8.parse(b)
  var d = CryptoJS.enc.Utf8.parse("0102030405060708")
  var e = CryptoJS.enc.Utf8.parse(a)
  var f = CryptoJS.AES.encrypt(e, c, {
    iv: d,
    mode: CryptoJS.mode.CBC
  })
  return f.toString()
}
function c(a, b, c) {
  var d, e
  return setMaxDigits(131),
  d = new RSAKeyPair(b, "", c),
  e = encryptedString(d, a)
}
function d(d, e, f, g) {
  var h = {}
  var i = a(16)
  h.encText = b(d, g)
  h.encText = b(h.encText, i)
  h.encSecKey = c(i, e, f)
  return h
}