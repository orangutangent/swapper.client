import { useExchangeOperations } from "@/shared/hooks/useExchangeOperations";
import { useTokenOperations } from "@/shared/hooks/useTokenOperations";
import React from "react";
import { parseUnits } from "viem";

interface Props {
  tokenAmount: string;
  ethAmount: string;
  tokenAddress: string;
  exchangeAddress: string;
  disabled?: boolean;
}

const AddLiquidityButton = ({
  tokenAmount,
  ethAmount,
  tokenAddress,
  exchangeAddress,
  disabled,
}: Props) => {
  const { approveTokens, isSending: isSendingToken } =
    useTokenOperations(tokenAddress);

  const { addLiquidity, isSending: isSendingExchange } =
    useExchangeOperations(exchangeAddress);

  const [isApproved, setIsApproved] = React.useState(false);

  const handleApprove = () => {
    approveTokens(
      exchangeAddress,
      parseUnits(tokenAmount, 18).toString(),
      () => {
        setIsApproved(true);
      }
    );
  };

  const handleAddLiquidity = () => {
    addLiquidity(tokenAmount, ethAmount);
    setIsApproved(false);
  };
  return (
    <div>
      <button
        onClick={isApproved ? handleAddLiquidity : handleApprove}
        disabled={
          disabled ||
          isSendingToken ||
          isSendingExchange ||
          tokenAmount === "0" ||
          ethAmount === "0"
        }
        className="w-full rounded-xl text-xl font-bold bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:bg-gray-500 ease-in-out duration-300 disabled:cursor-not-allowed"
      >
        <p className="p-2 text-white">
          {isApproved ? "Add Liquidity" : "Approve"}
        </p>
      </button>
    </div>
  );
};

export default AddLiquidityButton;
