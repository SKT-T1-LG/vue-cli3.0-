const crypto = require('crypto')

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCl0+yOleAMVbO0zW2WdC0TX6q7
g8kvCZxJRA4PuuqfqondTiUJTg6RUFSKc9vWbufdczprV+N8k2R4t8hq5oRfUKhJ
1XirsJcuKQsGg2P2/hG7g4mCZbyJrDYGuEaY8E1igQtidcIlOeaatygzhkadr/jT
EtonpJAn7oFCYOqzIQIDAQAB
-----END PUBLIC KEY-----`

export default {
  encryptKey (key) {
    let encodekey = crypto.publicEncrypt(publicKey, Buffer.from(key)).toString('base64')
    return encodekey
  },
  decryptData (data, key, iv) {
    if (!data) {
      return ''
    }
    iv = iv || ''
    let clearEncoding = 'utf8'
    let cipherEncoding = 'base64'
    let cipherChunks = []
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    decipher.setAutoPadding(true)
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding))
    cipherChunks.push(decipher.final(clearEncoding))
    return JSON.parse(cipherChunks.join(''))
  },
  encryptData (data, key, iv) {
    iv = iv || ''
    let clearEncoding = 'utf8'
    let cipherEncoding = 'base64'
    let cipherChunks = []
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
    cipher.setAutoPadding(true)
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding))
    cipherChunks.push(cipher.final(cipherEncoding))
    return cipherChunks.join('')
  }
}