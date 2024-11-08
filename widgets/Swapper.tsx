"use client";
import AmountInput from "@/shared/components/ui/AmountInput";
import SelectSearch from "@/shared/components/ui/SelectSearch";
import UpDown from "@/shared/icons/UpDown";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { formatEther, formatUnits, parseUnits } from "viem";

import exchanges1 from "@/shared/contracts/exchanges.json";
import { useExchangeOperations } from "@/shared/hooks/useExchangeOperations";
import Balance from "@/features/Balance";
import { useAccount, useChainId } from "wagmi";
import SwapButton, { SwapType } from "@/features/SwapButton";
import useCurrency from "@/shared/hooks/useCurrency";

import amoyExchanges from "@/shared/contracts/AMOY_Exchanges.json";
import fujiExchanges from "@/shared/contracts/FUJI_Exchanges.json";

import useExchanges from "@/shared/hooks/useExchanges";

// const options = exchanges1.map((exchange) => {
//   return {
//     name: exchange.name,
//     symbol: exchange.symbol,
//     address: exchange.address,
//     tokenAddress: exchange.tokenAddress,
//   } as ISelectOption;
// });
// options.push({
//   name: "Main",
//   symbol: "Main",
//   address: "0x0000000000000000000000000000000000000000",
//   tokenAddress: "0x0000000000000000000000000000000000000000",
// });

export const Swapper = () => {
  const currencyName = useCurrency();
  const chainID = useChainId();

  const exchanges = useExchanges();

  // if (!exchanges) return null;

  const { isConnected } = useAccount();
  const [value, setValue] = React.useState("0");
  const [token, setToken] = React.useState(exchanges[exchanges.length - 1]);
  const [token2, setToken2] = React.useState(exchanges[0]);
  const [amount, setAmount] = React.useState("0");
  const [tokenToETH, setTokenToETH] = React.useState("0");
  const [swapType, setSwapType] = React.useState(SwapType.ETH_TO_TOKEN);

  const [isFlipped, setIsFlipped] = React.useState(false);
  useEffect(() => {
    exchanges[exchanges.length - 1].symbol = currencyName;
    exchanges[exchanges.length - 1].name = currencyName;

    setToken(exchanges[exchanges.length - 1]);
    setToken2(exchanges[0]);
  }, [currencyName, chainID, exchanges]);

  const { useGetETHAmount } = useExchangeOperations(token.address);
  const { useGetTokenAmount } = useExchangeOperations(token2.address);
  const { data: etherAmount, isLoading: isLoadingEtherAmount } =
    useGetETHAmount(parseUnits(value, 18).toString());

  const { data: tokenAmount, isLoading: isLoadingTokenAmount } =
    useGetTokenAmount(parseUnits(value, 18).toString());
  const { data: tokenToTokenAmount, isLoading: isLoadingTokenToTokenAmount } =
    useGetTokenAmount(parseUnits(tokenToETH, 18).toString());

  const onToggleSwap = () => {
    setIsFlipped(!isFlipped);
    const token1 = token;
    setValue(amount);
    setToken(token2);
    setToken2(token1);
  };

  const getAmount = () => {
    if (token.symbol === exchanges[exchanges.length - 1].symbol) {
      setSwapType(SwapType.ETH_TO_TOKEN);
      if (!!tokenAmount) {
        return formatUnits(BigInt(tokenAmount as string), 18);
      }
      return "0";
    } else if (token2.symbol === exchanges[exchanges.length - 1].symbol) {
      setSwapType(SwapType.TOKEN_TO_ETH);

      return formatEther(BigInt(etherAmount ? (etherAmount as string) : "0"));
    } else {
      setSwapType(SwapType.TOKEN_TO_TOKEN);
      const ethAmount = BigInt(etherAmount ? (etherAmount as string) : "0");
      setTokenToETH(formatEther(ethAmount));
      if (!!tokenToTokenAmount) {
        return formatUnits(BigInt(tokenAmount as string), 18);
      }
      return "0";
    }
  };

  useEffect(() => {
    setAmount(getAmount());
  }, [
    token,
    tokenAmount,
    etherAmount,
    tokenToTokenAmount,
    tokenToETH,
    isLoadingTokenToTokenAmount,
    isLoadingEtherAmount,
    isLoadingTokenAmount,
    value,
    getAmount,
    token2,
    amount,
    exchanges,
    currencyName,
    chainID,
  ]);

  return (
    <div className="flex flex-col  max-w-[600px] w-full justify-center gap-4 ">
      <Balance
        tokenName={token.name}
        tokenSymbol={token.symbol}
        tokenAddress={token.tokenAddress}
      />
      <SelectSearch
        value={token}
        options={exchanges}
        onChange={(value) => value !== token2 && setToken(value)}
      />
      <AmountInput value={value} onChange={(e) => setValue(e.target.value)} />
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onClick={onToggleSwap}
        className="w-full flex justify-center cursor-pointer"
      >
        <UpDown className="w-8 h-8" />
      </motion.div>
      <SelectSearch
        value={token2}
        options={exchanges}
        onChange={(value) => value !== token && setToken2(value)}
      />
      <AmountInput
        disabled
        value={amount}
        onChange={(e) => setValue(e.target.value)}
      />
      <SwapButton
        disabled={!isConnected}
        amount={value}
        token1Address={token.tokenAddress}
        token2Address={token2.tokenAddress}
        exchange1Address={token.address}
        exchange2Address={token2.address}
        type={swapType}
        onClick={() => {
          console.log(Object.keys(SwapType), swapType, ": ", value);
        }}
        label="Swap"
      />
    </div>
  );
};
