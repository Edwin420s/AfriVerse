/**
 * Blockchain Configuration
 * Smart contracts, networks, and Web3 settings for AfriVerse
 */

// Contract Addresses (update with actual deployed addresses)
export const contractAddresses = {
  lineaTestnet: {
    UjuziRegistry: process.env.NEXT_PUBLIC_LINEA_TESTNET_REGISTRY || '0x0000000000000000000000000000000000000000',
    AfriToken: process.env.NEXT_PUBLIC_LINEA_TESTNET_TOKEN || '0x0000000000000000000000000000000000000000'
  },
  lineaMainnet: {
    UjuziRegistry: process.env.NEXT_PUBLIC_LINEA_MAINNET_REGISTRY || '0x0000000000000000000000000000000000000000',
    AfriToken: process.env.NEXT_PUBLIC_LINEA_MAINNET_TOKEN || '0x0000000000000000000000000000000000000000'
  },
  avalancheFuji: {
    UjuziRegistry: process.env.NEXT_PUBLIC_AVALANCHE_FUJI_REGISTRY || '0x0000000000000000000000000000000000000000',
    AfriToken: process.env.NEXT_PUBLIC_AVALANCHE_FUJI_TOKEN || '0x0000000000000000000000000000000000000000'
  },
  polygonMumbai: {
    UjuziRegistry: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_REGISTRY || '0x0000000000000000000000000000000000000000',
    AfriToken: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_TOKEN || '0x0000000000000000000000000000000000000000'
  }
}

// Network Configurations
export const networks = {
  lineaTestnet: {
    id: 59140,
    name: 'Linea Goerli Testnet',
    chainId: '0xe704',
    network: 'linea-testnet',
    nativeCurrency: {
      name: 'Linea ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: {
      default: 'https://rpc.goerli.linea.build',
      public: 'https://rpc.goerli.linea.build'
    },
    blockExplorerUrls: ['https://goerli.lineascan.build'],
    testnet: true
  },
  lineaMainnet: {
    id: 59144,
    name: 'Linea Mainnet',
    chainId: '0xe708',
    network: 'linea-mainnet',
    nativeCurrency: {
      name: 'Linea ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: {
      default: 'https://rpc.linea.build',
      public: 'https://rpc.linea.build'
    },
    blockExplorerUrls: ['https://lineascan.build'],
    testnet: false
  },
  avalancheFuji: {
    id: 43113,
    name: 'Avalanche Fuji Testnet',
    chainId: '0xa869',
    network: 'avalanche-fuji',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: {
      default: 'https://api.avax-test.network/ext/bc/C/rpc',
      public: 'https://api.avax-test.network/ext/bc/C/rpc'
    },
    blockExplorerUrls: ['https://testnet.snowtrace.io'],
    testnet: true
  },
  polygonMumbai: {
    id: 80001,
    name: 'Polygon Mumbai',
    chainId: '0x13881',
    network: 'polygon-mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: {
      default: 'https://rpc-mumbai.maticvigil.com',
      public: 'https://rpc-mumbai.maticvigil.com'
    },
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    testnet: true
  }
}

// Default Network
export const defaultNetwork = process.env.NEXT_PUBLIC_DEFAULT_NETWORK || 'lineaTestnet'

// Get current network configuration
export function getCurrentNetwork() {
  return networks[defaultNetwork]
}

// Get contract address for current network
export function getContractAddress(contractName, networkKey = null) {
  const network = networkKey || defaultNetwork
  return contractAddresses[network]?.[contractName]
}

// Smart Contract ABIs
export const contractABIs = {
  UjuziRegistry: [
    // Submit entry
    'function submitEntry(bytes32 cid, string license) external returns (uint)',
    
    // Validate entry
    'function validateEntry(uint entryId, bool approve) external',
    
    // Get entry
    'function getEntry(uint entryId) external view returns (tuple(bytes32 cid, address author, uint256 timestamp, string license, uint8 status))',
    
    // Get entry count
    'function getEntryCount() external view returns (uint)',
    
    // Get entries by author
    'function getEntriesByAuthor(address author) external view returns (uint[] memory)',
    
    // Events
    'event EntrySubmitted(uint indexed entryId, bytes32 cid, address author)',
    'event EntryValidated(uint indexed entryId, bool approved, address validator)',
    'event EntryRejected(uint indexed entryId, string reason, address validator)'
  ],
  
  AfriToken: [
    // Standard ERC20
    'function name() external view returns (string)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)',
    'function totalSupply() external view returns (uint256)',
    'function balanceOf(address account) external view returns (uint256)',
    'function transfer(address recipient, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)',
    
    // Custom functions
    'function mint(address to, uint256 amount) external',
    'function burn(uint256 amount) external',
    
    // Events
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)'
  ]
}

// Gas Settings
export const gasSettings = {
  submitEntry: {
    gasLimit: 300000,
    maxPriorityFeePerGas: 2000000000, // 2 gwei
    maxFeePerGas: 100000000000 // 100 gwei
  },
  validateEntry: {
    gasLimit: 150000,
    maxPriorityFeePerGas: 2000000000,
    maxFeePerGas: 100000000000
  },
  transfer: {
    gasLimit: 100000,
    maxPriorityFeePerGas: 2000000000,
    maxFeePerGas: 100000000000
  }
}

// Transaction Confirmation Settings
export const confirmationSettings = {
  requiredConfirmations: 2,
  timeout: 120000, // 2 minutes
  pollingInterval: 3000 // 3 seconds
}

// Wallet Connect Settings
export const walletConnectSettings = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  metadata: {
    name: 'AfriVerse',
    description: 'Preserving African indigenous knowledge',
    url: 'https://afriverse.io',
    icons: ['https://afriverse.io/icon.png']
  },
  supportedChains: [
    networks.lineaTestnet.id,
    networks.lineaMainnet.id,
    networks.avalancheFuji.id,
    networks.polygonMumbai.id
  ]
}

// IPFS Settings
export const ipfsSettings = {
  gateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs',
  pinningService: process.env.NEXT_PUBLIC_IPFS_PINNING_SERVICE || 'web3storage',
  web3StorageToken: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
}

// Entry Status on Blockchain
export const EntryStatus = {
  PENDING: 0,
  VALIDATED: 1,
  REJECTED: 2,
  FLAGGED: 3
}

// Transaction Status
export const TransactionStatus = {
  PENDING: 'pending',
  CONFIRMING: 'confirming',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

// Helper Functions

/**
 * Get network by chain ID
 */
export function getNetworkByChainId(chainId) {
  const chainIdHex = typeof chainId === 'number' 
    ? `0x${chainId.toString(16)}` 
    : chainId

  return Object.values(networks).find(
    network => network.chainId.toLowerCase() === chainIdHex.toLowerCase()
  )
}

/**
 * Check if network is supported
 */
export function isNetworkSupported(chainId) {
  return !!getNetworkByChainId(chainId)
}

/**
 * Get block explorer URL for transaction
 */
export function getBlockExplorerUrl(txHash, networkKey = null) {
  const network = networks[networkKey || defaultNetwork]
  return `${network.blockExplorerUrls[0]}/tx/${txHash}`
}

/**
 * Get block explorer URL for address
 */
export function getAddressExplorerUrl(address, networkKey = null) {
  const network = networks[networkKey || defaultNetwork]
  return `${network.blockExplorerUrls[0]}/address/${address}`
}

/**
 * Format transaction error
 */
export function formatTransactionError(error) {
  if (error.code === 4001) {
    return 'Transaction rejected by user'
  }
  if (error.code === -32603) {
    return 'Internal error. Please try again.'
  }
  if (error.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  }
  if (error.message?.includes('gas')) {
    return 'Gas estimation failed. Transaction may fail.'
  }
  return error.message || 'Transaction failed'
}

/**
 * Estimate transaction cost
 */
export function estimateTransactionCost(gasLimit, gasPriceGwei) {
  const gasPriceWei = gasPriceGwei * 1e9
  const costWei = gasLimit * gasPriceWei
  const costEth = costWei / 1e18
  return costEth.toFixed(6)
}

// Export all configurations
export default {
  contractAddresses,
  networks,
  defaultNetwork,
  contractABIs,
  gasSettings,
  confirmationSettings,
  walletConnectSettings,
  ipfsSettings,
  EntryStatus,
  TransactionStatus,
  getCurrentNetwork,
  getContractAddress,
  getNetworkByChainId,
  isNetworkSupported,
  getBlockExplorerUrl,
  getAddressExplorerUrl,
  formatTransactionError,
  estimateTransactionCost
}
