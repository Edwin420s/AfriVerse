const { ethers } = require('ethers');

/**
 * BlockchainService
 * 
 * Provides convenience methods to interact with the AfriVerse on-chain registry
 * for provenance anchoring and validation events. It expects the following
 * environment variables to be configured:
 * - WEB3_PROVIDER: RPC URL for the target network (e.g. Linea testnet)
 * - PRIVATE_KEY: Signer private key for sending transactions (hot wallet or relayer)
 * - CONTRACT_ADDRESS: Deployed UjuziRegistry/Ujuzi-like contract address
 * 
 * ABI used is the minimal interface for submitEntry, validateEntry and getEntry.
 */
class BlockchainService {
  /**
   * Initializes the BlockchainService instance.
   * 
   * Sets up the provider, wallet, contract address, and contract instance.
   */
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contractAddress = process.env.CONTRACT_ADDRESS;

    this.contractABI = [
      "function submitEntry(bytes32 cid, string calldata license) external returns (uint)",
      "function validateEntry(uint entryId, bool approve) external",
      "function getEntry(uint entryId) external view returns (tuple(bytes32 cid, address author, uint256 timestamp, string license, uint8 status))",
      "event EntrySubmitted(uint indexed entryId, bytes32 cid, address author)",
      "event EntryValidated(uint indexed entryId, bool approved, address validator)"
    ];
    this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.wallet);
  }

  /**
   * Submit a new entry CID + license to the registry.
   * @param {string} cid - The IPFS CID (string) to anchor.
   * @param {string} [license="CC-BY-NC-4.0"] - License string to store with the entry.
   * @returns {Promise<{success: boolean, transactionHash?: string, entryId?: number, blockNumber?: number, error?: string}>}
   */
  async submitEntry(cid, license = "CC-BY-NC-4.0") {
    try {
      const cidBytes32 = ethers.encodeBytes32String(cid);
      
      const tx = await this.contract.submitEntry(cidBytes32, license);
      const receipt = await tx.wait();
      
      // Extract entryId from event
      const event = receipt.logs.find(log => 
        log.topics[0] === ethers.id("EntrySubmitted(uint256,bytes32,address)")
      );
      
      const entryId = parseInt(event.topics[1]);
      
      return {
        success: true,
        transactionHash: receipt.hash,
        entryId,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Blockchain Submit Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate an existing entry on-chain.
   * @param {number} entryId - The on-chain entry ID.
   * @param {boolean} [approve=true] - Approval decision.
   * @returns {Promise<{success: boolean, transactionHash?: string, entryId?: number, approved?: boolean, blockNumber?: number, error?: string}>}
   */
  async validateEntry(entryId, approve = true) {
    try {
      const tx = await this.contract.validateEntry(entryId, approve);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        entryId,
        approved: approve,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Blockchain Validate Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Fetch and normalize an entry from the registry.
   * @param {number} entryId - The on-chain entry ID.
   * @returns {Promise<{cid: string, author: string, timestamp: Date, license: string, status: string}>}
   */
  async getEntry(entryId) {
    try {
      const entry = await this.contract.getEntry(entryId);
      const cid = ethers.decodeBytes32String(entry.cid);
      
      return {
        cid,
        author: entry.author,
        timestamp: new Date(entry.timestamp * 1000),
        license: entry.license,
        status: this.mapStatus(entry.status)
      };
    } catch (error) {
      console.error('Blockchain Get Error:', error);
      throw new Error(`Failed to get entry: ${error.message}`);
    }
  }

  /**
   * Map contract status code to human-readable status.
   * @param {number} statusCode
   * @returns {string}
   */
  mapStatus(statusCode) {
    const statusMap = {
      0: 'pending',
      1: 'validated', 
      2: 'rejected'
    };
    return statusMap[statusCode] || 'unknown';
  }

  /**
   * Retrieve current gas fee data from the provider.
   * @returns {Promise<{gasPrice?: bigint, maxFeePerGas?: bigint, maxPriorityFeePerGas?: bigint} | null>}
   */
  async getGasEstimate() {
    try {
      const feeData = await this.provider.getFeeData();
      return {
        gasPrice: feeData.gasPrice,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
      };
    } catch (error) {
      console.error('Gas Estimate Error:', error);
      return null;
    }
  }
}

module.exports = new BlockchainService();