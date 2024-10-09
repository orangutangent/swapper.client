"use client";
import React from "react";
import { useTokenOperations } from "@/shared/hooks/useTokenOperations";
import { useAccount, useBalance } from "wagmi";
import { formatEther, formatUnits } from "viem";
import useCurrency from "@/shared/hooks/useCurrency";

interface Props {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol?: string;
}

const Balance = ({
  tokenAddress,
  tokenName,
  tokenSymbol = tokenName,
}: Props) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { useGetMyBalance } = useTokenOperations(tokenAddress);
  const { data: tokenBalance } = useGetMyBalance();
  const currencyName = useCurrency();

  return (
    <div className="text-xl flex justify-between border-2 p-2 gap-4 rounded-2xl  border-slate-600 items-center w-full ">
      {!!tokenBalance && (
        <>
          <div className="w-max">{` Your ${tokenName} balance `}</div>
          <div className="flex gap-1 rounded-full bg-slate-600 p-1">
            <p
              title={formatUnits(BigInt(tokenBalance as string), 18)}
              className="max-w-[100px] truncate"
            >
              {formatUnits(BigInt(tokenBalance as string), 18)}
            </p>
            <p>{tokenSymbol}</p>
          </div>
        </>
      )}
      {tokenBalance === BigInt(0) && (
        <>
          <div className="">{`Your ${tokenName} balance `}</div>
          <div className="flex gap-1  rounded-full bg-slate-600 p-1">
            <p title="0" className=" truncate ">
              0
            </p>
            <p>{tokenSymbol}</p>
          </div>
        </>
      )}
      {tokenSymbol === currencyName && balance && (
        <>
          <div className="">{`Your ${tokenName} balance `}</div>
          <div className="flex gap-1  rounded-full bg-slate-600 p-1">
            <p
              title={formatEther(balance.value)}
              className=" truncate max-w-[100px] "
            >
              {formatEther(balance.value)}
            </p>
            <p>{tokenSymbol}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Balance;
