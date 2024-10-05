"use client";
import { useExchangeOperations } from "@/shared/hooks/useExchangeOperations";
import { useTokenOperations } from "@/shared/hooks/useTokenOperations";
import React from "react";

export enum SwapType {
  ETH_TO_TOKEN,
  TOKEN_TO_ETH,
  TOKEN_TO_TOKEN,
}

interface Props {
  disabled?: boolean;
  onClick?: () => void;
  label: string;
  amount: string;
  type: SwapType;
  token1Address: string;
  token2Address: string;
  exchange1Address: string;
  exchange2Address: string;
}

const SwapButton = ({
  disabled,
  onClick,
  label,
  amount,
  type,
  token1Address,
  token2Address,
  exchange1Address,
  exchange2Address,
}: Props) => {
  const {
    swapTokenToETH,
    swapTokenToToken,
    isSending: isSendingExchange1,
  } = useExchangeOperations(exchange1Address);
  const { swapETHtoToken, isSending: isSendingExchange2 } =
    useExchangeOperations(exchange2Address);
  const { approveTokens, isSending: isSendingToken } =
    useTokenOperations(token1Address);
  const swap = () => {
    switch (type) {
      case SwapType.ETH_TO_TOKEN: {
        swapETHtoToken(amount);
        break;
      }
      case SwapType.TOKEN_TO_ETH: {
        approveTokens(token1Address, amount);
        swapTokenToETH(amount);
        break;
      }
      case SwapType.TOKEN_TO_TOKEN: {
        approveTokens(token1Address, amount);
        swapTokenToToken(amount, token2Address);
        break;
      }
    }
  };
  return (
    <button
      onClick={swap}
      disabled={
        disabled || isSendingExchange1 || isSendingExchange2 || isSendingToken
      }
      className="w-full rounded-xl text-xl font-bold bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:bg-gray-500 ease-in-out duration-300 disabled:cursor-not-allowed"
    >
      <p className="p-2 text-white">{label}</p>
    </button>
  );
};

export default SwapButton;
