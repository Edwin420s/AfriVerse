const axios = require('axios');
const FormData = require('form-data');

/**
 * IPFSService
 *
 * Handles IPFS interactions via Pinata API for uploading, fetching, and unpinning
 * files. Configure one of the following authentication methods via env vars:
 * - PINATA_JWT: Preferred, a JWT token from Pinata
 * - PINATA_API_KEY and PINATA_SECRET_API_KEY: Legacy API key/secret (optional)
 */
class IPFSService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecret = process.env.PINATA_SECRET_API_KEY;
    this.pinataJWT = process.env.PINATA_JWT;
  }

  /**
   * Upload a file buffer to IPFS using Pinata.
   * @param {Buffer} buffer - File bytes to upload.
   * @param {string} filename - Original filename for metadata.
   * @returns {Promise<{cid: string, pinSize: number, timestamp: string}>}
   */
  async uploadFile(buffer, filename) {
    try {
      const formData = new FormData();
      formData.append('file', buffer, { filename });
      
      const metadata = JSON.stringify({
        name: filename,
        keyvalues: {
          project: 'afriverse',
          timestamp: Date.now().toString()
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.pinataJWT}`,
            ...formData.getHeaders()
          }
        }
      );

      return {
        cid: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp
      };
    } catch (error) {
      console.error('IPFS Upload Error:', error);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  /**
   * Retrieve file bytes from the IPFS gateway for a given CID.
   * @param {string} cid - IPFS CID.
   * @returns {Promise<Buffer>} - Raw file data.
   */
  async getFile(cid) {
    try {
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${cid}`,
        { responseType: 'arraybuffer' }
      );
      return response.data;
    } catch (error) {
      console.error('IPFS Fetch Error:', error);
      throw new Error(`IPFS fetch failed: ${error.message}`);
    }
  }

  /**
   * Unpin a previously pinned CID from Pinata.
   * @param {string} cid - IPFS CID to unpin.
   * @returns {Promise<boolean>} - True if unpinned, false on error.
   */
  async unpinFile(cid) {
    try {
      await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${cid}`,
        {
          headers: {
            'Authorization': `Bearer ${this.pinataJWT}`
          }
        }
      );
      return true;
    } catch (error) {
      console.error('IPFS Unpin Error:', error);
      return false;
    }
  }
}

module.exports = new IPFSService();