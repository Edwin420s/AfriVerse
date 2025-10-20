const axios = require('axios');
const FormData = require('form-data');

class IPFSService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecret = process.env.PINATA_SECRET_API_KEY;
    this.pinataJWT = process.env.PINATA_JWT;
  }

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