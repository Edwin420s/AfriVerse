/**
 * Blockchain Utilities
 * Web3 and blockchain interaction utilities for AfriVerse
 */

import { ethers } from 'ethers'

// Contract ABIs (simplified - replace with full ABI in production)
export const CONTRACT_ABIS = {
  UjuziRegistry: [
    'function submitEntry(bytes32 cid, string license) external returns (uint)',
    'function validateEntry(uint entryId, bool approve) external',
    'function getEntry(uint entryId) external view returns (tuple(bytes32 cid, address author, uint256 timestamp, string license, uint8 status))',
    'event EntrySubmitted(uint indexed entryId, bytes32 cid, address author)',
    'event EntryValidated(uint indexed entryId, bool approved, address validator)'
  ]
}

// Network configurations
export const NETWORKS = {
  lineaTestnet: {
    chainId: '0xe704',
    chainName: 'Linea Goerli Testnet',
    nativeCurrency: {
      name: 'Linea ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.goerli.linea.build'],
    blockExplorerUrls: ['https://goerli.lineascan.build']
  },
  lineaMainnet: {
    chainId: '0xe708',
    chainName: 'Linea Mainnet',
    nativeCurrency: {
      name: 'Linea ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.linea.build'],
    blockExplorerUrls: ['https://lineascan.build']
  },
  avalancheFuji: {
    chainId: '0xa869',
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io']
  },
  polygonMumbai: {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  }
}

// Get provider from window.ethereum
export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return null
}

// Get signer (current connected account)
export async function getSigner() {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No wallet provider found')
  }
  return await provider.getSigner()
}

// Connect wallet
export async function connectWallet() {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet')
    }

    const provider = getProvider()
    const accounts = await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const network = await provider.getNetwork()

    return {
      success: true,
      address,
      chainId: network.chainId.toString(),
      provider,
      signer
    }
  } catch (error) {
    console.error('Wallet connection error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Disconnect wallet
export function disconnectWallet() {
  // Note: MetaMask doesn't have a disconnect method
  // Users need to manually disconnect from the wallet interface
  return {
    success: true,
    message: 'Please disconnect from your wallet extension'
  }
}

// Switch network
export async function switchNetwork(networkKey) {
  try {
    const network = NETWORKS[networkKey]
    if (!network) {
      throw new Error('Network not supported')
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }]
    })

    return { success: true }
  } catch (error) {
    // If network doesn't exist, add it
    if (error.code === 4902) {
      try {
        const network = NETWORKS[networkKey]
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [network]
        })
        return { success: true }
      } catch (addError) {
        return { success: false, error: addError.message }
      }
    }
    return { success: false, error: error.message }
  }
}

// Get contract instance
export function getContract(contractAddress, abi, signerOrProvider) {
  if (!contractAddress || !abi || !signerOrProvider) {
    throw new Error('Contract address, ABI, and signer/provider are required')
  }
  return new ethers.Contract(contractAddress, abi, signerOrProvider)
}

// Submit entry to blockchain
export async function submitEntryToChain(cid, license, contractAddress) {
  try {
    const signer = await getSigner()
    const contract = getContract(contractAddress, CONTRACT_ABIS.UjuziRegistry, signer)

    // Convert CID to bytes32
    const cidBytes32 = ethers.id(cid)

    const tx = await contract.submitEntry(cidBytes32, license)
    const receipt = await tx.wait()

    // Extract entryId from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log)
        return parsed.name === 'EntrySubmitted'
      } catch {
        return false
      }
    })

    const entryId = event ? contract.interface.parseLog(event).args.entryId : null

    return {
      success: true,
      transactionHash: receipt.hash,
      entryId: entryId?.toString(),
      blockNumber: receipt.blockNumber
    }
  } catch (error) {
    console.error('Submit entry error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Validate entry on blockchain
export async function validateEntryOnChain(entryId, approved, contractAddress) {
  try {
    const signer = await getSigner()
    const contract = getContract(contractAddress, CONTRACT_ABIS.UjuziRegistry, signer)

    const tx = await contract.validateEntry(entryId, approved)
    const receipt = await tx.wait()

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber
    }
  } catch (error) {
    console.error('Validate entry error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get entry from blockchain
export async function getEntryFromChain(entryId, contractAddress) {
  try {
    const provider = getProvider()
    const contract = getContract(contractAddress, CONTRACT_ABIS.UjuziRegistry, provider)

    const entry = await contract.getEntry(entryId)

    return {
      success: true,
      entry: {
        cid: entry.cid,
        author: entry.author,
        timestamp: entry.timestamp.toString(),
        license: entry.license,
        status: entry.status
      }
    }
  } catch (error) {
    console.error('Get entry error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Sign message
export async function signMessage(message) {
  try {
    const signer = await getSigner()
    const signature = await signer.signMessage(message)

    return {
      success: true,
      signature,
      message
    }
  } catch (error) {
    console.error('Sign message error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Verify signature
export function verifySignature(message, signature, expectedAddress) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()

    return {
      success: true,
      isValid,
      recoveredAddress
    }
  } catch (error) {
    console.error('Verify signature error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get account balance
export async function getBalance(address) {
  try {
    const provider = getProvider()
    const balance = await provider.getBalance(address)
    const balanceInEth = ethers.formatEther(balance)

    return {
      success: true,
      balance: balanceInEth,
      balanceWei: balance.toString()
    }
  } catch (error) {
    console.error('Get balance error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get transaction receipt
export async function getTransactionReceipt(txHash) {
  try {
    const provider = getProvider()
    const receipt = await provider.getTransactionReceipt(txHash)

    return {
      success: true,
      receipt: {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        status: receipt.status,
        gasUsed: receipt.gasUsed.toString()
      }
    }
  } catch (error) {
    console.error('Get transaction receipt error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Listen to contract events
export function listenToEvents(contractAddress, eventName, callback) {
  try {
    const provider = getProvider()
    const contract = getContract(contractAddress, CONTRACT_ABIS.UjuziRegistry, provider)

    contract.on(eventName, (...args) => {
      callback({
        eventName,
        args,
        blockNumber: args[args.length - 1].blockNumber
      })
    })

    return {
      success: true,
      unsubscribe: () => contract.off(eventName)
    }
  } catch (error) {
    console.error('Listen to events error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Format address (shorten for display)
export function formatAddress(address, startChars = 6, endChars = 4) {
  if (!address) return ''
  if (address.length < startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

// Check if address is valid
export function isValidAddress(address) {
  try {
    return ethers.isAddress(address)
  } catch {
    return false
  }
}

// Convert to checksum address
export function toChecksumAddress(address) {
  try {
    return ethers.getAddress(address)
  } catch (error) {
    console.error('Invalid address:', error)
    return null
  }
}

// Get current network
export async function getCurrentNetwork() {
  try {
    const provider = getProvider()
    const network = await provider.getNetwork()

    return {
      success: true,
      chainId: network.chainId.toString(),
      name: network.name
    }
  } catch (error) {
    console.error('Get network error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Estimate gas for transaction
export async function estimateGas(contractAddress, method, args) {
  try {
    const signer = await getSigner()
    const contract = getContract(contractAddress, CONTRACT_ABIS.UjuziRegistry, signer)

    const gasEstimate = await contract[method].estimateGas(...args)

    return {
      success: true,
      gasEstimate: gasEstimate.toString()
    }
  } catch (error) {
    console.error('Estimate gas error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Export all utilities
export default {
  getProvider,
  getSigner,
  connectWallet,
  disconnectWallet,
  switchNetwork,
  getContract,
  submitEntryToChain,
  validateEntryOnChain,
  getEntryFromChain,
  signMessage,
  verifySignature,
  getBalance,
  getTransactionReceipt,
  listenToEvents,
  formatAddress,
  isValidAddress,
  toChecksumAddress,
  getCurrentNetwork,
  estimateGas,
  NETWORKS,
  CONTRACT_ABIS
}
