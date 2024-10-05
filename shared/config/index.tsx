import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "My Swapper App",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [
    {
      ...polygonAmoy,
      iconUrl:
        "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    },
    // sepolia,
  ],
  ssr: true,
});
