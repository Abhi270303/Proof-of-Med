export const eduChainNetwork = {
  id: 421614,
  network: "Arbitrum Sepolia",
  name: "Arbitrum Sepolia (Testnet)",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia-rollup.arbitrum.io/rpc"],
    },
    public: {
      http: ["https://sepolia-rollup.arbitrum.io/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "sepolia.arbiscan.io",
    },
  },
};
