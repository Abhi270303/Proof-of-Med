export const baseSepNetwork = {
  id: 84532,
  network: "Base Sepolia",
  name: "Base Sepolia Testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", 
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
    public: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://sepolia-explorer.base.org",
    },
  },
};