"use client";

import { useChainId } from "wagmi";

const useCurrency = (): string => {
  const chainId = useChainId();
  switch (chainId) {
    case 1:
      return "ETH";
    case 80002:
      return "MATIC";
    case 137:
      return "MATIC";
    case 43113:
      return "AVAX";
    default:
      return "ETH";
  }
};

export default useCurrency;
