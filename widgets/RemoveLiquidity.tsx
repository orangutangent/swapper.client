"use client";
import { AmountInput } from "@/shared/components/ui/AmountInput";
import { SelectSearch } from "@/shared/components/ui/SelectSearch";
import { useExchangeOperations } from "@/shared/hooks/useExchangeOperations";
import React, { useEffect } from "react";
import exchanges from "@/shared/contracts/exchanges.json";
import Balance from "@/features/Balance";
import { parseEther } from "viem";
import { useBalance } from "wagmi";
import useCurrency from "@/shared/hooks/useCurrency";
import { motion } from "framer-motion";
import { useTokenOperations } from "@/shared/hooks/useTokenOperations";
import Link from "next/link";
import RemoveLiquidityButton from "@/features/RemoveLiquidityButton";

import {
  getLiquidityAmount as getAmount,
  shakeAnimation,
} from "@/shared/lib/utils";

const options = exchanges;

const RemoveLiquidity = () => {
  const [amountLP, setAmountLP] = React.useState("0");
  const [token, setToken] = React.useState(options[0]);
  const currentCurrency = useCurrency();
  const exchangeBalance = useBalance({
    address: `0x${token.address.slice(2)}`,
  });
  const { useGetMyLPBalance, useGetTokenReserve } = useExchangeOperations(
    token.address
  );
  const [tokenAmount, setTokenAmount] = React.useState("0");
  const [currAmount, setCurrAmount] = React.useState("0");
  const { useGetTotalSupply } = useTokenOperations(token.address);

  const { data: totalSupplyLP } = useGetTotalSupply();
  useEffect(() => {
    if (amountLP && tokenReserve && !!totalSupplyLP) {
      const _tokenAmount = getAmount(
        amountLP,
        tokenReserve as string,
        totalSupplyLP?.toString()
      );
      setTokenAmount(_tokenAmount);
    }
    if (amountLP && exchangeBalance.data?.value && totalSupplyLP) {
      const _currAmount = getAmount(
        amountLP,
        exchangeBalance.data?.value.toString(),
        totalSupplyLP?.toString()
      );
      setCurrAmount(_currAmount);
    }
  }, [amountLP]);

  const { data: LPBalance } = useGetMyLPBalance();

  const { data: tokenReserve } = useGetTokenReserve();

  return (
    <div className="flex flex-col max-w-[600px] w-full justify-center gap-4">
      <Balance
        tokenName={token.name}
        tokenSymbol={token.symbol}
        tokenAddress={token.tokenAddress}
      />
      <Balance
        tokenName={"LP"}
        tokenSymbol={"LP"}
        tokenAddress={token.address}
      />
      <Link
        className="text-blue-500 hover:scale-105 active:scale-95 duration-300 ease-in-out text-center"
        href={"/pool"}
      >
        add liquidity
      </Link>
      <p className="text-xl">Choose a token</p>
      <SelectSearch
        value={token}
        onChange={(e) => setToken(e)}
        options={options}
      />

      {currentCurrency && <p>Amount in LP</p>}
      <div className="max-w-[400px] space-y-2">
        <AmountInput
          value={amountLP}
          onChange={(e) => setAmountLP(e.target.value)}
        />
        {Number(parseEther(amountLP)) > Number(LPBalance) && (
          <motion.p
            variants={shakeAnimation}
            initial="initial"
            animate="animate"
            className="text-red-500"
          >
            Insufficient LP balance
          </motion.p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <p>
          You{"'"}ll receive in {currentCurrency}:{" "}
        </p>
        {!!exchangeBalance.data?.value && (
          <h3>
            {currAmount} {currentCurrency}
          </h3>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <p>
          You{"'"}ll receive in {token.symbol}:{" "}
        </p>
        {!!tokenReserve && !!exchangeBalance.data?.value && (
          <h3>
            {tokenAmount} {token.symbol}
          </h3>
        )}
      </div>
      <RemoveLiquidityButton
        amountLP={amountLP}
        exchangeAddress={token.address}
      />
    </div>
  );
};

export default RemoveLiquidity;
