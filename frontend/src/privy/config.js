import { baseSepNetwork } from "./chains";

export const privyConfig = {
  appId: "cm6m0pvh200ljic16kbrb82t1",
  config: {
    appearance: {
      theme: "dark",
      logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgEQeT5vG-bqbdCBQxX4s6M0ltqKSmXFxKkEioRyUmbsQh7lGB9bz-6-EWutS1ri_PERLKPzSo7sPiI4ml3cmaL140PLmKmtmBqWAqPAY1lG3mZdm5xmwGpHaP1YtQpYBsxzOcE1p9FGiTXh2lZiTcETdz7amNyVescHomxMm8NvckPBxuwRMGZz6nxOwo/s1600/Graphic%20Elements%281%29.png",
      // walletList: ["metamask", "detected_wallets", "rainbow"],
    },
    loginMethods: ["twitter"],
    defaultChain: baseSepNetwork,
    supportedChains: [baseSepNetwork],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
  },
};
