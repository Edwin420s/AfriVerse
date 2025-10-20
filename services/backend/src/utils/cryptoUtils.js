const crypto = require('crypto');

class CryptoUtils {
  static generateHash(data) {
    return crypto
      .createHash('sha256')
      .update(typeof data === 'string' ? data : JSON.stringify(data))
      .digest('hex');
  }

  static generateRandomString(length = 32) {
    return crypto
      .randomBytes(length)
      .toString('hex')
      .slice(0, length);
  }

  static validateSignature(data, signature, publicKey) {
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(JSON.stringify(data));
      verify.end();
      return verify.verify(publicKey, signature, 'hex');
    } catch (error) {
      return false;
    }
  }

  static encrypt(text, key) {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      iv: iv.toString('hex'),
      data: encrypted,
      authTag: authTag.toString('hex')
    };
  }

  static decrypt(encryptedData, key) {
    const algorithm = 'aes-256-gcm';
    const decipher = crypto.createDecipher(algorithm, key);
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  static generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
  }

  static createHMAC(data, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  static verifyHMAC(data, hmac, secret) {
    const expectedHmac = this.createHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(hmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    );
  }
}

module.exports = CryptoUtils;