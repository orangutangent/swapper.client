"use client";
import AmountInput from "@/shared/components/ui/AmountInput";
import SelectSearch from "@/shared/components/ui/SelectSearch";
import { useExchangeOperations } from "@/shared/hooks/useExchangeOperations";
import React, { useEffect } from "react";
// import exchanges from "@/shared/contracts/exchanges.json";
import Balance from "@/features/Balance";
import { formatUnits, parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import useCurrency from "@/shared/hooks/useCurrency";
import { motion } from "framer-motion";
import { useTokenOperations } from "@/shared/hooks/useTokenOperations";
import AddLiquidityButton from "@/features/AddLiquidityButton";
import Link from "next/link";

import { shakeAnimation, getTokenAmount } from "@/shared/lib/utils";
import useExchanges from "@/shared/hooks/useExchanges";
import { IEXCHANGE } from "@/shared/interfaces";

// const options = exchanges;

const AddLiquidity = () => {
  const exchanges = useExchanges(false);
  // if (!exchanges) return null;
  const [amount, setAmount] = React.useState("0");
  const [token, setToken] = React.useState<IEXCHANGE>(exchanges[0]);

  const currentCurrency = useCurrency();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { useGetTokenReserve } = useExchangeOperations(token?.address);
  const [tokenAmount, setTokenAmount] = React.useState("0");
  useEffect(() => {
    if (amount && tokenReserve && exchangeBalance.data?.value) {
      const _tokenAmount = getTokenAmount(
        amount,
        tokenReserve as string,
        exchangeBalance.data?.value.toString()
      );
      setTokenAmount(_tokenAmount);
    }
  }, [amount]);
  const { useGetMyBalance } = useTokenOperations(token?.tokenAddress);
  const { data: tokenBalance } = useGetMyBalance();

  const { data: tokenReserve } = useGetTokenReserve();

  const exchangeBalance = useBalance({
    address: `0x${token?.address?.slice(2)}`,
  });

  // if (!token) return null;

  return (
    <div className="flex flex-col max-w-[600px]  w-full justify-center gap-4">
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
        href={"/pool/remove"}
      >
        remove liquidity
      </Link>
      <p className="text-xl">Choose a token</p>
      <SelectSearch
        value={token}
        onChange={(e) => setToken(e)}
        options={exchanges}
      />

      {currentCurrency && <p>Amount in {currentCurrency}</p>}
      <div className="max-w-[400px] space-y-2">
        <AmountInput
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {Number(parseEther(amount)) > Number(balance?.value) && (
          <motion.p
            variants={shakeAnimation}
            initial="initial"
            animate="animate"
            className="text-red-500"
          >
            Insufficient {currentCurrency} balance
          </motion.p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <p>Amount in {token.symbol}: </p>
        {!!tokenReserve && !!exchangeBalance.data?.value && (
          <h3>
            {tokenAmount} {token.symbol}
          </h3>
        )}
        {!!tokenBalance &&
          Number(tokenAmount) >
            Number(formatUnits(BigInt(tokenBalance as string), 18)) && (
            <motion.p
              variants={shakeAnimation}
              initial="initial"
              animate="animate"
              className="text-red-500"
            >
              Insufficient {token.name} balance
            </motion.p>
          )}
      </div>
      <AddLiquidityButton
        tokenAddress={token.tokenAddress}
        tokenAmount={tokenAmount}
        ethAmount={amount}
        exchangeAddress={token.address}
      />
    </div>
  );
};

export default AddLiquidity;
