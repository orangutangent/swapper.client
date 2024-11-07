/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useBridgeOperations } from "@/shared/hooks/useBridgeOperations";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import React, { useEffect } from "react";

import avaZeroX from "@/shared/contracts/AVA_ZeroX.json";
import amoyZeroX from "@/shared/contracts/AMOY_ZeroX.json";
import Balance from "@/features/Balance";
import { Button } from "@/shared/components/ui/button";
import { Chain, formatEther, parseUnits } from "viem";
import { useChainId, useChains } from "wagmi";
import Image from "next/image";
import Right from "@/shared/icons/Right";
import AmountInput from "@/shared/components/ui/AmountInput";

export interface CustomChain extends Chain {
  iconUrl?: string;
}

const page = () => {
  const [amount, setAmount] = React.useState("0");
  const [address, setAddress] = React.useState("0x");
  const [to, setTo] = React.useState<EndpointId>(EndpointId.AMOY_V2_TESTNET);

  const chains = useChains();
  const chainId = useChainId();
  const [fromChain, setFromChain] = React.useState<CustomChain>(
    chains.find((c) => c.id === (chainId as number))!
  );
  const [toChain, setToChain] = React.useState<CustomChain>(
    chains.find((c) => c.id !== (chainId as number))!
  );

  useEffect(() => {
    switch (chainId) {
      case 43113:
        setAddress(avaZeroX.address);
        setTo(EndpointId.AMOY_V2_TESTNET);
        setFromChain(chains.find((c) => c.id === 43113)!);
        setToChain(chains.find((c) => c.id !== 43113)!);
        break;
      case 80002:
        setAddress(amoyZeroX.address);
        setTo(EndpointId.AVALANCHE_V2_TESTNET);
        setFromChain(chains.find((c) => c.id === 80002)!);
        setToChain(chains.find((c) => c.id !== 80002)!);
        break;
    }
  }, [chainId]);
  const { useGetFeeQuote, send } = useBridgeOperations(
    to,
    parseUnits(amount, 18).toString()
  );
  const [fee, setFee] = React.useState("0");
  const { data, isLoading, error, isError } = useGetFeeQuote();
  useEffect(() => {
    // console.log("data", data);
    // console.log("isLoading", isLoading);
    // console.log("error", error);
    if (!isLoading && !isError && data && (data as any).nativeFee) {
      setFee((data as any).nativeFee.toString());
    }
  }, [data, isLoading, isError, error]);
  return (
    <div className="w-full max-w-[500px] mx-auto  flex flex-col gap-4 items-center justify-center p-4 h-full">
      <h1 className="text-3xl">Bridge</h1>
      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <Image src={fromChain?.iconUrl || ""} width={30} height={30} alt="" />
          <p className="text-center "> {fromChain?.name}</p>
        </div>
        <Right width={30} height={30} />
        <div className="flex gap-2 items-center">
          <Image src={toChain?.iconUrl || ""} width={30} height={30} alt="" />
          <p className="text-center "> {toChain?.name}</p>
        </div>
      </div>
      <Balance tokenAddress={address} tokenName="ZRX" />
      <AmountInput
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        placeholder="Amount"
        className="w-full"
      />
      <div className="flex gap-2 items-center">
        <p>Transaction fee:</p>
        <p className="font-bold text-red-500">
          {formatEther(BigInt(fee)).slice(0, 8)}
        </p>
      </div>
      <Button
        className="w-full text-white rounded-xl max-w-[300px] text-xl font-bold bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:bg-gray-500 ease-in-out duration-300 disabled:cursor-not-allowed"
        disabled={fee === "0"}
        onClick={() => {
          console.log("fee", fee);
          if (fee === "0") return;
          send(fee);
        }}
      >
        Send
      </Button>
    </div>
  );
};

export default page;
