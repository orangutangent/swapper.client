"use client";
import { useExchangeOperations } from "@/shared/hooks/useExchangeOperations";
import React from "react";

interface Props {
  amountLP: string;
  exchangeAddress: string;
  disabled?: boolean;
}

const RemoveLiquidityButton = ({
  amountLP,
  exchangeAddress,
  disabled,
}: Props) => {
  const { removeLiquidity, isSending: isSendingExchange } =
    useExchangeOperations(exchangeAddress);

  const handleRemoveLiquidity = () => {
    removeLiquidity(amountLP);
  };
  return (
    <div>
      <button
        onClick={handleRemoveLiquidity}
        disabled={disabled || isSendingExchange || amountLP === "0"}
        className="w-full rounded-xl text-xl font-bold bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:bg-gray-500 ease-in-out duration-300 disabled:cursor-not-allowed"
      >
        <p className="p-2 text-white">Remove Liquidity</p>
      </button>
    </div>
  );
};

export default RemoveLiquidityButton;
