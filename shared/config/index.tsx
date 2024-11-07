import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  polygonAmoy,
  avalancheFuji,
  //  sepolia
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "My Swapper App",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [
    {
      ...polygonAmoy,
      iconUrl:
        "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    },
    {
      ...avalancheFuji,
      iconUrl:
        "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png?_=d233cfd",
      rpcUrls: {
        default: { http: ["https://avalanche-fuji-c-chain.publicnode.com"] },
      },
    },
    // sepolia,
  ],
  ssr: true,
});
